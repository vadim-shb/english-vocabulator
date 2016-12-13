package domain

import play.api.libs.json.Json

case class EmailCredentials(email: String, password: String)

object EmailCredentials {
  implicit val format = Json.format[EmailCredentials]
}
