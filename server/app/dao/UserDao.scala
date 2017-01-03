package dao

import javax.inject.Singleton

import domain.{SecurityUser, SecurityUserSessionTokens, User}
import persistence.DbConnected
import scalikejdbc._, jsr310._

@Singleton
class UserDao extends DbConnected {

  def userMapper(rs: WrappedResultSet)(implicit session: DBSession) = {
    User(
      id = rs.long("id"),
      email = rs.string("email")
    )
  }

  def userAuthSessionTokensMapper(rs: WrappedResultSet)(implicit session: DBSession) = {
    SecurityUserSessionTokens(
      userId = rs.long("user_id"),
      accessToken = rs.string("access_token"),
      refreshToken = rs.string("refresh_token"),
      accessTokenExpirationTime = rs.localDateTime("access_token_expiration_time"),
      refreshTokenExpirationTime = rs.localDateTime("refresh_token_expiration_time")
    )
  }

  def addUser(user: SecurityUser): SecurityUser = {
    insideLocalTx { implicit session =>
      val persistedUserId =sql"""INSERT INTO t_user(
                           email,
                           salt,
                           password_hash
                        ) VALUES (
                           ${user.email},
                           ${user.salt},
                           ${user.passwordHash}
                        )""".updateAndReturnGeneratedKey().apply
      user.copy(id = Some(persistedUserId))
    }
  }

  def findSecurityUserByEmail(email: String): Option[SecurityUser] = {
    insideReadOnly { implicit session =>
      sql"""SELECT * FROM t_user WHERE email = ${email}"""
        .map(rs =>
          SecurityUser(
            id = rs.longOpt("id"),
            email = rs.string("email"),
            salt = rs.string("salt"),
            passwordHash = rs.string("password_hash")
          )
        ).single.apply
    }
  }

  def createAuthSession(sessionTokens: SecurityUserSessionTokens): Unit = {
    insideLocalTx { implicit session =>
      sql"""INSERT INTO t_user_auth_tokens (
              user_id,
              access_token,
              refresh_token,
              access_token_expiration_time,
              refresh_token_expiration_time
            ) VALUES (
              ${sessionTokens.userId},
              ${sessionTokens.accessToken},
              ${sessionTokens.refreshToken},
              ${sessionTokens.accessTokenExpirationTime},
              ${sessionTokens.refreshTokenExpirationTime}
            )""".execute.apply
    }
  }

  def findAuthSessionByAccessToken(accessToken: String): Option[SecurityUserSessionTokens] = {
    insideReadOnly { implicit session =>
      sql"""SELECT * FROM t_user_auth_tokens WHERE access_token = ${accessToken}"""
        .map(userAuthSessionTokensMapper).single.apply
    }
  }

  def findAuthSessionByRefreshToken(refreshToken: String): Option[SecurityUserSessionTokens] = {
    insideReadOnly { implicit session =>
      sql"""SELECT * FROM t_user_auth_tokens WHERE refresh_token = ${refreshToken}"""
        .map(userAuthSessionTokensMapper).single.apply
    }
  }

  def updateAuthSessionTokens(sessionTokens: SecurityUserSessionTokens): Unit = {
    insideLocalTx { implicit session =>
      sql"""UPDATE t_user_auth_tokens SET
              access_token = ${sessionTokens.accessToken},
              refresh_token = ${sessionTokens.refreshToken},
              access_token_expiration_time = ${sessionTokens.accessTokenExpirationTime},
              refresh_token_expiration_time = ${sessionTokens.refreshTokenExpirationTime}
            WHERE user_id = ${sessionTokens.userId}""".execute
    }
  }

  def removeAuthSessionByAccessToken(accessToken: String) = {
    insideLocalTx { implicit session =>
      sql"DELETE FROM t_user_auth_tokens WHERE access_token = ${accessToken}".execute.apply
    }
  }

}
