package controllers

import _root_.service.SecurityService
import domain.Credentials
import play.api.libs.json.Json
import play.api.mvc._

class SecurityController extends Controller {

  def signIn = Action(parse.json) { request =>
    request.body.asOpt[Credentials].map(credentials => {
      SecurityService.authenticate(credentials).map(authenticatedUser => {
        Ok(Json.toJson(authenticatedUser))
      }).getOrElse(NotFound)
    }).getOrElse(BadRequest)
  }

  def signOut = Action { implicit request =>
    SecurityService.logout
    Ok
  }
}
