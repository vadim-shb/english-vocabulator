package domain

import play.api.libs.json.Json

case class User(id: Long, email: String)

object User {
  implicit val format = Json.format[User]
}