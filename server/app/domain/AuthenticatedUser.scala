package domain

import play.api.libs.json.Json

case class AuthenticatedUser(accessToken: String, refreshToken: String, user: User)

object AuthenticatedUser {
  implicit val format = Json.format[AuthenticatedUser]
}