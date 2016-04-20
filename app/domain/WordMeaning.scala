package domain

import play.api.libs.json.Json

case class WordMeaning(
                        id: Option[Long],
                        positionInOrder: Int,
                        meaning: String
                      )

object WordMeaning {
  implicit val format = Json.format[WordMeaning]
}