package domain

import play.api.libs.json.Json

case class AuthenticatedUser(accessToken: String, user: User)

object AuthenticatedUser {
  implicit val format = Json.format[AuthenticatedUser]
}