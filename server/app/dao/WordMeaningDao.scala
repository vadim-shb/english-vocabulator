package dao

import javax.inject.Singleton

import domain.WordMeaning
import persistence.DbConnected
import scalikejdbc._

@Singleton
class WordMeaningDao extends DbConnected {

  def wordMapper(rs: WrappedResultSet) = {
    val id = rs.long("id")
    WordMeaning(
      id = Some(id),
      positionInOrder = rs.int("position_in_order"),
      meaning = rs.string("meaning")
    )
  }

  def findMeanings(wordId: Long)(implicit session: DBSession) = {
    sql"SELECT * FROM t_word_meaning WHERE word_id = ${wordId}"
      .map(wordMapper).list.apply
  }

  def create(wordId: Long, wordMeaning: WordMeaning)(implicit session: DBSession) = {
    val persistedWordMeaningId =
      sql"""INSERT INTO t_word_meaning(
              word_id,
              position_in_order,
              meaning
            ) VALUES (
              ${wordId},
              ${wordMeaning.positionInOrder},
              ${wordMeaning.meaning}
            )"""
        .updateAndReturnGeneratedKey.apply
    wordMeaning.copy(id = Some(persistedWordMeaningId))
  }

}