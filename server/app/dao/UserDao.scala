package dao

import javax.inject.Singleton

import domain.{SecurityUser, SecurityUserSessionTokens, User}
import persistence.DbConnected
import scalikejdbc._
import scalikejdbc.jsr310._

@Singleton
class UserDao extends DbConnected {

  def userMapper(rs: WrappedResultSet) = {
    User(
      id = rs.long("id"),
      email = rs.string("email")
    )
  }

  def securityUserMapper(rs: WrappedResultSet) = {
    SecurityUser(
      id = rs.longOpt("id"),
      email = rs.string("email"),
      salt = rs.string("salt"),
      passwordHash = rs.string("password_hash")
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

  def addInactiveUser(user: SecurityUser, emailConfirmationToken: String): Unit = {
    insideLocalTx { implicit session =>
      sql"""INSERT INTO t_inactive_user(
                           email,
                           salt,
                           password_hash,
                           email_confirmation_token
                        ) VALUES (
                           ${user.email},
                           ${user.salt},
                           ${user.passwordHash},
                           ${emailConfirmationToken}
                        )""".update.apply
    }
  }

  def addUser(user: SecurityUser)(implicit session: DBSession): SecurityUser = {
    val persistedUserId =
      sql"""INSERT INTO t_user(
                           email,
                           salt,
                           password_hash
                        ) VALUES (
                           ${user.email},
                           ${user.salt},
                           ${user.passwordHash}
                        )""".updateAndReturnGeneratedKey.apply
    user.copy(id = Some(persistedUserId))
  }

  def clearInactiveUsersWithEmail(email: String)(implicit session: DBSession): Unit = {
      sql"""DELETE FROM t_inactive_user WHERE email = ${email}""".update.apply
  }

  def findInactiveUser(emailConfirmationToken: String)(implicit session: DBSession): Option[SecurityUser] = {
    sql"""SELECT * FROM t_inactive_user WHERE email_confirmation_token = ${emailConfirmationToken}"""
      .map(securityUserMapper).single.apply
  }

  def findSecurityUserByEmail(email: String): Option[SecurityUser] = {
    insideReadOnly { implicit session =>
      sql"""SELECT * FROM t_user WHERE email = ${email}"""
        .map(securityUserMapper).single.apply
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
