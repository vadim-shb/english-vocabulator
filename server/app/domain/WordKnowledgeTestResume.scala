package domain

import java.time.LocalDateTime

import play.api.libs.json.Json

case class WordKnowledgeTestResume(
                                    id: Option[Long],
                                    wordId: Long,
                                    testType: String,
                                    testResult: String,
                                    testDateTime: Option[LocalDateTime],
                                    testDuration: Int
                                  )

object WordKnowledgeTestResume {
  implicit val format = Json.format[WordKnowledgeTestResume]
}