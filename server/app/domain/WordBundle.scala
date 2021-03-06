package domain

import play.api.libs.json.Json

case class WordBundle(
                       id: Option[Long],
                       name: String,
                       importance: Byte,
                       wordIds: Seq[Long]
                     )

object WordBundle {
  implicit val format = Json.format[WordBundle]
}
