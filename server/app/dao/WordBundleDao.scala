package dao

import javax.inject.Singleton

import domain.WordBundle
import persistence.DbConnected
import scalikejdbc._

@Singleton
class WordBundleDao extends DbConnected {


  private def wordBundleMapper(rs: WrappedResultSet)(implicit session: DBSession) = {
    val id = rs.long("id")
    WordBundle(
      id = Some(id),
      name = rs.string("name"),
      importance = rs.byte("importance"),
      words = findWordIdsInBundle(id)
    )
  }

  private def findWordIdsInBundle(wordBundleId: Long)(implicit session: DBSession): Seq[Long] = {
    sql"""SELECT word_id FROM t_word_in_bundle WHERE word_bundle_id = ${wordBundleId}"""
      .map(_.long("word_id")).list.apply
  }

  def findWordBundles(ownerId: Long)(implicit session: DBSession): Seq[WordBundle] = {
    sql"SELECT * FROM t_word_bundle WHERE owner_id = ${ownerId}"
      .map(wordBundleMapper).list.apply
  }

  def create(wordBundle: WordBundle, ownerId: Long)(implicit session: DBSession) = {
    val persistedWordBundleId =
      sql"""INSERT INTO t_word_bundle(
          name,
          importance,
          owner_id
         ) VALUES (
          ${wordBundle.name},
          ${wordBundle.importance},
          ${ownerId}
         )"""
        .updateAndReturnGeneratedKey.apply

    wordBundle.copy(id = Some(persistedWordBundleId))
  }

  //  def update(word: Word)(implicit session: DBSession): Unit = {
  //    sql"""UPDATE t_word SET
  //            word = ${word.word},
  //            importance = ${word.importance},
  //            meaning = ${word.meaning},
  //            usage_examples = ${word.usageExamples}
  //          WHERE id = ${word.id}"""
  //      .execute.apply
  //  }

}