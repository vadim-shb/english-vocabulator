package domain

import play.api.libs.json.Json

case class LearnCollection(
                        id: Option[Long],
                        userId: Option[Long],
                        name: String
                      )

object LearnCollection {
  implicit val format = Json.format[LearnCollection]
}