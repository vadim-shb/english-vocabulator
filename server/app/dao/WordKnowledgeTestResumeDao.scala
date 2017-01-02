package dao

import javax.inject.Singleton

import domain.WordKnowledgeTestResume
import persistence.DbConnected
import scalikejdbc._
import scalikejdbc.jsr310._

@Singleton
class WordKnowledgeTestResumeDao extends DbConnected {

  private def learnCollectionMapper(rs: WrappedResultSet)(implicit session: DBSession) = {
    WordKnowledgeTestResume(
      id = rs.longOpt("id"),
      wordId = rs.long("word_id"),
      testResult = rs.string("test_result"),
      testType = rs.string("test_type"),
      testDateTime = rs.localDateTimeOpt("test_date_time"),
      testDuration = rs.int("test_duration_ms")
    )
  }

  def addWordKnowledgeTestResume(testResume: WordKnowledgeTestResume, userId: Long)(implicit session: DBSession) = {
    val persistedWordLearnAnswerId =
      sql"""INSERT INTO t_word_knowledge_test_resume (
         user_id,
         word_id,
         test_result,
         test_type,
         test_duration_ms
         ) VALUES (
          ${userId},
          ${testResume.wordId},
          ${testResume.testResult},
          ${testResume.testType},
          ${testResume.testDuration}
         )"""
        .updateAndReturnGeneratedKey.apply

    testResume.copy(id = Some(persistedWordLearnAnswerId))
  }

}