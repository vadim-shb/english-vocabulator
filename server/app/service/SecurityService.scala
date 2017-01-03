package service

import java.time.LocalDateTime
import java.util.UUID
import javax.inject.{Inject, Singleton}

import dao.UserDao
import domain._
import org.apache.commons.codec.digest.DigestUtils
import org.apache.commons.lang3.RandomStringUtils
import play.api.Configuration
import play.api.mvc.Request
import throwables.DuplicateInsertionException

import scala.util.{Failure, Success, Try}

@Singleton
class SecurityService @Inject()(configuration: Configuration, userDao: UserDao) {

  private val accessTokenTTL = configuration.getInt("security.accessTokenTTL").get
  private val refreshTokenTTL = configuration.getInt("security.refreshTokenTTL").get

  def signUp(credentials: EmailCredentials): Try[AuthenticatedUser] = {
    val lowerCaseEmail = credentials.email.toLowerCase
    userDao.findSecurityUserByEmail(lowerCaseEmail) match {
      case Some(_) => Failure(DuplicateInsertionException("User with such email is already exists"))
      case None => {
        val salt = RandomStringUtils.randomAlphanumeric(6)
        val persistedSecurityUser = userDao.addUser(
          SecurityUser(
            email = credentials.email.toLowerCase,
            salt = salt,
            passwordHash = DigestUtils.sha512Hex(credentials.password + salt)
          )
        )
        Success(signIn(credentials).get)
      }
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

  private def getAccessToken[A](implicit request: Request[A]) : Option[String] = {
    request.headers.get("Authorization")
  }

  def getUserId[A](implicit request: Request[A]) : Option[Long]= {
    val accessTokenOpt = getAccessToken
    accessTokenOpt.flatMap(accessToken => userDao.findAuthSessionByAccessToken(accessToken).map(_.userId))
  }

}
