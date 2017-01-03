package domain

import play.api.libs.json.Json

case class Word(
                 id: Option[Long],
                 word: String,
                 meaning: String,
                 usageExamples: String,
                 importance: Byte
               )

object Word {
  implicit val format = Json.format[Word]
}