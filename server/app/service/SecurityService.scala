package service

import java.time.LocalDateTime
import java.util.UUID
import javax.inject.{Inject, Singleton}

import dao.UserDao
import domain._
import org.apache.commons.codec.digest.DigestUtils
import org.apache.commons.lang3.RandomStringUtils
import persistence.DbConnected
import play.api.Configuration
import play.api.libs.mailer._
import play.api.mvc.Request

@Singleton
class SecurityService @Inject()(configuration: Configuration, userDao: UserDao, mailerClient: MailerClient) extends DbConnected {

  private val accessTokenTTL = configuration.getInt("security.accessTokenTTL").get
  private val refreshTokenTTL = configuration.getInt("security.refreshTokenTTL").get

  def signUp(credentials: EmailCredentials): Unit = {
    val checkEmailToken = RandomStringUtils.randomAlphanumeric(64)
    val salt = RandomStringUtils.randomAlphanumeric(6)
    val securityUser = SecurityUser(
      email = credentials.email,
      salt = salt,
      passwordHash = DigestUtils.sha512Hex(credentials.password + salt)
    )
    userDao.addInactiveUser(securityUser, checkEmailToken)
    sendRegistrationEmail(securityUser, checkEmailToken)
  }

  private def sendRegistrationEmail(securityUser: SecurityUser, emailConfirmationToken: String) = {
    val email = Email(
      subject = "Effectivelang registration confirmation",
      from = "Effectivelang.com <robot@effectivelang.com>",
      to = Seq(s"${securityUser.email.split("@")(0)} TO <${securityUser.email}>"),
      bodyText = Some(
        s"""Welcome to Effective Lang!
           |
           |It is just one step before you can start improving your vocabulary reactively!
           |To activate your account please follow the link:
           |
           |https://effectivelang.com/api/security/activate-account/${emailConfirmationToken}
           |
           |
           |
           |
           |
           |
           |
           |
           |The Effective Lang Team
           |https://effectivelang.com
           |""".stripMargin),
      bodyHtml = Some(
        s"""<html><body>
           |<style>
           |    body {
           |        font-family: Arial, Helvetica, sans-serif;
           |        font-size: 20px;
           |        margin: 20px;
           |    }
           |    p {
           |        display: inline-block;
           |        margin-right: 10px;
           |    }
           |    h2 {
           |        margin-bottom: 30px;
           |    }
           |    div {
           |        margin-bottom: 15px;
           |    }
           |    a {
           |        text-decoration: none;
           |        color: #337ab7;
           |        font-weight: 400;
           |    }
           |    a:hover {
           |        color: #23527c;
           |        text-decoration: underline;
           |    }
           |</style>
           |<h2>Welcome to Effective Lang!</h2>
           |<div>
           |    <p>It is just one step before you can start improving your vocabulary reactively!</p>
           |</div>
           |<div>
           |    <p>To activate your account please follow the link:</p>
           |    <a class="activator" href="https://effectivelang.com/api/security/activate-account/${emailConfirmationToken}">Activate
           |        the account</a>
           |</div>
           |<br/><br/><br/><br/><br/><br/><br/><br/>
           |<div>
           |    <p>The Effective Lang Team</p><br/>
           |    <a class="link" href="https://effectivelang.com">effectivelang.com</a>
           |</div>
           |</body></html>""".stripMargin)
    )
    mailerClient.send(email)
  }

  def activateUserAccount(emailConfirmationToken: String): Option[SecurityUser] = {
    insideLocalTx { implicit session =>
      userDao.findInactiveUser(emailConfirmationToken).map(inactiveUser => {
        val activatedUser = userDao.addUser(inactiveUser)
        userDao.clearInactiveUsersWithEmail(activatedUser.email)
        activatedUser
      })
    }
  }

  def signIn(credentials: EmailCredentials): Option[AuthenticatedUser] = {
    userDao.findSecurityUserByEmail(credentials.email.toLowerCase).flatMap(securityUser => {
      val passwordHash = DigestUtils.sha512Hex(credentials.password + securityUser.salt)
      if (passwordHash == securityUser.passwordHash) {
        val sessionTokens = SecurityUserSessionTokens(
          userId = securityUser.id.get,
          accessToken = UUID.randomUUID().toString,
          refreshToken = UUID.randomUUID().toString,
          accessTokenExpirationTime = LocalDateTime.now().plusSeconds(accessTokenTTL),
          refreshTokenExpirationTime = LocalDateTime.now().plusSeconds(refreshTokenTTL)
        )
        userDao.createAuthSession(sessionTokens)
        Some(AuthenticatedUser(
          accessToken = sessionTokens.accessToken,
          refreshToken = sessionTokens.refreshToken,
          user = User(
            id = securityUser.id.get,
            email = securityUser.email
          )
        ))
      } else {
        None
      }
    })
  }

  def signOut[A](implicit request: Request[A]) = {
    val accessTokenOpt = getAccessToken
    accessTokenOpt.foreach(accessToken => userDao.removeAuthSessionByAccessToken(accessToken))
  }

  //  def refreshAccessToken(refreshToken: String): Try[AuthenticatedUser] = {
  //    userDao.findUserByRefreshToken(refreshToken).map(user => {
  //      sessions.put(accessToken, (DateTime.now(), user))
  //      userDao.updateTokens(userId = user.id.get, accessToken = UUID.randomUUID().toString, refreshToken = UUID.randomUUID().toString)
  //      Success(AuthenticatedUser(
  //        accessToken = persistedSecurityUser.accessToken.get,
  //        refreshToken = persistedSecurityUser.refreshToken.get,
  //        user = User(
  //          id = persistedSecurityUser.id.get,
  //          email = persistedSecurityUser.email
  //        )
  //      ))
  //    })
  //  }

  private def getAccessToken[A](implicit request: Request[A]): Option[String] = {
    request.headers.get("Authorization")
  }

  def getUserId[A](implicit request: Request[A]): Option[Long] = {
    val accessTokenOpt = getAccessToken
    accessTokenOpt.flatMap(accessToken => userDao.findAuthSessionByAccessToken(accessToken).map(_.userId))
  }

}
