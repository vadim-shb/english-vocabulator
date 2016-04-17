package domain

import play.api.libs.json.Json

case class Credentials(username: String, password: String)

object Credentials {
  implicit val format = Json.format[Credentials]
}
