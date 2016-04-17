package domain

import play.api.libs.json.Json

case class User(id: Long, username: String)

object User {
  implicit val format = Json.format[User]
}