package dao

import javax.inject.{Inject, Singleton}

import domain.Word
import persistence.DbConnected
import scalikejdbc._

@Singleton
class WordDao @Inject()(wordMeaningDao: WordMeaningDao) extends DbConnected {

  private def wordMapper(rs: WrappedResultSet)(implicit session: DBSession) = {
    val id = rs.long("id")
    Word(
      id = Some(id),
      word = rs.string("word"),
      meanings = wordMeaningDao.findMeanings(id),
      importance = rs.byte("importance")
    )
  }

  def findWord(wordId: Long)(implicit session: DBSession): Option[Word] = {
    sql"SELECT * FROM t_word WHERE id = ${wordId}"
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
          owner_id
         ) VALUES (
          ${word.word},
          ${word.importance},
          ${ownerId}
         )"""
        .updateAndReturnGeneratedKey.apply
    val persistedWordMeanings = word.meanings.map(wordMeaning => wordMeaningDao.create(persistedWordId, wordMeaning))

    word.copy(id = Some(persistedWordId), meanings = persistedWordMeanings)
  }

}