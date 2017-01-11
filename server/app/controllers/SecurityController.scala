package controllers

import javax.inject.Inject

import _root_.service.SecurityService
import domain.EmailCredentials
import play.api.libs.json.Json
import play.api.mvc._
import throwables.DuplicateInsertionException
import utils.CurrentUserOrForbidden

import scala.util.{Failure, Success}

class SecurityController @Inject()(
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
    request.body.asOpt[EmailCredentials].map(credentials => {
      securityService.signUp(credentials).map(authenticatedUser => {
        Ok(Json.toJson(authenticatedUser))
      }) match {
        case Success(response) => response
        case Failure(_: DuplicateInsertionException) => Conflict
      }
    }).getOrElse(BadRequest)
  }

  def signOut(userId: Long) = currentUserOrForbidden(userId) {
    Action { implicit request =>
      securityService.signOut
      Ok
    }
  }
}
