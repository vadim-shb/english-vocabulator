package utils

import javax.inject.{Inject, Singleton}

import play.api.mvc._
import service.SecurityService

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

@Singleton
class CurrentUserOrForbidden @Inject()(securityService: SecurityService) extends Controller {

  def apply[A](userId: Long)(action: Action[A]) = Action.async(action.parser) { implicit request =>
    securityService.getUser(request).map(currentUser => {
      if (userId == currentUser.id) {
        action(request)
      } else Future {
        Forbidden
      }
    }).getOrElse(Future {
      Forbidden
    })
  }

}
