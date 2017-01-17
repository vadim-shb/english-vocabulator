package controllers

import javax.inject.Inject

import _root_.service.SecurityService
import dao.UserDao
import domain.EmailCredentials
import play.api.libs.json.Json
import play.api.mvc._
import utils.CurrentUserOrForbidden

class SecurityController @Inject()(
                                    userDao: UserDao,
                                    securityService: SecurityService,
                                    currentUserOrForbidden: CurrentUserOrForbidden
                                  ) extends Controller {

  def signIn = Action(parse.json) { request =>
    request.body.asOpt[EmailCredentials].map(credentials => {
      securityService.signIn(credentials).map(authenticatedUser => {
        Ok(Json.toJson(authenticatedUser))
      }).getOrElse(NotFound)
    }).getOrElse(BadRequest)
  }

  def signUp = Action(parse.json) { request =>
    request.body.asOpt[EmailCredentials]
      .map(credentials => credentials.copy(email = credentials.email.toLowerCase()))
      .map(credentials => {
        userDao.findSecurityUserByEmail(credentials.email) match {
          case None => {
            securityService.signUp(credentials)
            Ok
          }
          case Some(_) => Conflict
        }
      }).getOrElse(BadRequest)
  }

  def signOut(userId: Long) = currentUserOrForbidden(userId) {
    Action { implicit request =>
      securityService.signOut
      Ok
    }
  }

  def activateAccount(emailConfirmationToken: String) = Action {
    securityService.activateUserAccount(emailConfirmationToken)
      .map(activatedUser => Redirect("/registration-complete"))
      .getOrElse(NotFound)
  }
}
