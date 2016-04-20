package domain

import play.api.libs.json.Json

case class Word(
                 id: Option[Long],
                 word: String,
                 meanings: Seq[WordMeaning]
               )

object Word {
  implicit val format = Json.format[Word]
}