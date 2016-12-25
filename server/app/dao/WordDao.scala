package dao

import javax.inject.Singleton

import domain.Word
import persistence.DbConnected
import scalikejdbc._

@Singleton
class WordDao extends DbConnected {

  private def wordMapper(rs: WrappedResultSet)(implicit session: DBSession) = {
    val id = rs.long("id")
    Word(
      id = Some(id),
      word = rs.string("word"),
      importance = rs.byte("importance"),
      meaning = rs.string("meaning"),
      usageExamples = rs.string("usage_examples")
    )
  }

  def findWord(wordId: Long, ownerId: Long)(implicit session: DBSession): Option[Word] = {
    sql"SELECT * FROM t_word WHERE id = ${wordId} AND owner_id = ${ownerId}"
      .map(wordMapper).single.apply
  }

  def findWords(ownerId: Long)(implicit session: DBSession): List[Word] = {
    sql"SELECT * FROM t_word WHERE owner_id = ${ownerId}"
      .map(wordMapper).list.apply
  }

  def findWordsInLearnCollection(learnCollectionId: Long)(implicit session: DBSession): List[Word] = {
    sql"""SELECT t_word.*
          FROM t_word
          JOIN t_word_in_learn_collection ON t_word_in_learn_collection.word_id = t_word.id
          WHERE t_word_in_learn_collection.learn_collection_id = ${learnCollectionId}"""
      .map(wordMapper).list.apply
  }

  def create(word: Word, ownerId: Long)(implicit session: DBSession) = {
    val persistedWordId =
      sql"""INSERT INTO t_word(
          word,
          importance,
          meaning,
          usage_examples,
          owner_id
         ) VALUES (
          ${word.word},
          ${word.importance},
          ${word.meaning},
          ${word.usageExamples},
          ${ownerId}
         )"""
        .updateAndReturnGeneratedKey.apply

    word.copy(id = Some(persistedWordId))
  }

  def update(word: Word)(implicit session: DBSession) : Word = {
    sql"""UPDATE t_word SET
            word = ${word.word},
            importance = ${word.importance},
            meaning = ${word.meaning},
            usage_examples = ${word.usageExamples}
          WHERE id = ${word.id}"""
      .execute.apply
    word
  }

}