package service

import java.util.UUID
import java.util.concurrent.ConcurrentHashMap
import javax.inject.{Inject, Singleton}

import dao.UserDao
import domain.{AuthenticatedUser, Credentials, User}
import org.joda.time.{DateTime, Seconds}
import play.api.Configuration
import play.api.mvc.{AnyContent, Request}

import scala.collection.concurrent
import scala.collection.convert.decorateAsScala._

@Singleton
class SecurityService @Inject()(configuration: Configuration, userDao: UserDao) {

  val accessTokenTTL = configuration.getInt("security.accessToken.ttl").get

  private val sessions: concurrent.Map[String, (DateTime, User)] = new ConcurrentHashMap[String, (DateTime, User)]().asScala //todo: Memory leak here. Need to clean old sessions ones per month (for example)

  def authenticate(credentials: Credentials): Option[AuthenticatedUser] = {
    userDao.findUserByUsername(credentials.username).map(user => {
      val accessToken = UUID.randomUUID().toString
      sessions.put(accessToken, (DateTime.now(), user))
      AuthenticatedUser(accessToken, user)
    })
  }

  def logout[A](implicit request: Request[A]) = {
    val accessTokenOpt = getAccessToken
    accessTokenOpt.foreach(accessToken => sessions.remove(accessToken))
  }

  def getAccessToken[A](implicit request: Request[A]) = {
    request.headers.get("Authorization")
  }

  def getUser[A](implicit request: Request[A]) = {
    val accessTokenOpt = getAccessToken
    accessTokenOpt.flatMap(accessToken => getUserByAccessToken(accessToken))
  }

  private def getUserByAccessToken(accessToken: String) = {
    sessions.get(accessToken)
      .filter(authentication => isAlive(authentication._1))
      .map(authentication => authentication._2)
  }

  private def isAlive(authDateTime: DateTime) = {
    Seconds.secondsBetween(DateTime.now(), authDateTime).getSeconds < accessTokenTTL
  }

  def cleanUnavailable() = {
    getOldAccessTokens.foreach(accessToken => sessions.remove(accessToken))
  }

  private def getOldAccessTokens = {
    sessions.filter({
      case (accessToken, (authDateTime, user)) => !isAlive(authDateTime)
    }).map({
      case (accessToken, (authDateTime, user)) => accessToken
    })
  }

}

/**
  * Unsafe !!!
  * Only for authenticated users
  */
@Singleton
class AuthorizedSecurityService @Inject() (securityService: SecurityService) {

  def getUserId[A](implicit request: Request[A]) = {
    getUser(request).id
  }

  def getUser[A](implicit request: Request[A]) = {
    securityService.getUser(request).get
  }

  def getAccessToken[A](implicit request: Request[A]) = {
    securityService.getAccessToken.get
  }
}

