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
      meanings = wordMeaningDao.findMeanings(id)
    )
  }

  def findWord(wordId: Long)(implicit session: DBSession): Option[Word] = {
    sql"SELECT * FROM t_word WHERE id = ${wordId}"
      .map(wordMapper).single.apply
  }

  def findWords(implicit session: DBSession): List[Word] = {
    sql"SELECT * FROM t_word"
      .map(wordMapper).list.apply
  }

  def create(word: Word)(implicit session: DBSession) = {
    val persistedWordId =
      sql"""INSERT INTO t_word(
          word
         ) VALUES (
          ${word.word}
         )"""
        .updateAndReturnGeneratedKey.apply
    val persistedWordMeanings = word.meanings.map(wordMeaning => wordMeaningDao.create(persistedWordId, wordMeaning))

    word.copy(id = Some(persistedWordId), meanings = persistedWordMeanings)
  }

}