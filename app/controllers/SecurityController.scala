package controllers

import javax.inject.Inject

import _root_.service.SecurityService
import domain.Credentials
import play.api.libs.json.Json
import play.api.mvc._

class SecurityController @Inject() (securityService: SecurityService) extends Controller {

  def signIn = Action(parse.json) { request =>
    request.body.asOpt[Credentials].map(credentials => {
      securityService.authenticate(credentials).map(authenticatedUser => {
        Ok(Json.toJson(authenticatedUser))
      }).getOrElse(NotFound)
    }).getOrElse(BadRequest)
  }

  def signOut = Action { implicit request =>
    securityService.logout
    Ok
  }
}
