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
      wordIds = findWordIdsInBundle(id)
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

  def findWordBundle(wordBundleId: Long, ownerId: Long)(implicit session: DBSession): Option[WordBundle] = {
    sql"SELECT * FROM t_word_bundle WHERE id = ${wordBundleId} AND owner_id = ${ownerId}"
      .map(wordBundleMapper).single.apply
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

  def update(wordBundle: WordBundle, userId: Long)(implicit session: DBSession): WordBundle = {
    sql"""UPDATE t_word_bundle SET
              name = ${wordBundle.name},
              importance = ${wordBundle.importance}
            WHERE id = ${wordBundle.id} AND owner_id = ${userId}"""
      .execute.apply
    wordBundle
  }

  def removeWordBundle(wordBundleId: Long, userId: Long)(implicit session: DBSession): Boolean = {
    val removedRowsNumber =
      sql"""DELETE FROM t_word_bundle WHERE id = ${wordBundleId} AND owner_id = ${userId}"""
        .update.apply
    removedRowsNumber == 1
  }

  def addWordToBundle(wordId: Long, wordBundleId: Long, userId: Long)(implicit session: DBSession): Boolean = {
    val insertedRowsNumber =
      sql"""INSERT INTO t_word_in_bundle(word_bundle_id,word_id)
            SELECT ${wordBundleId}, ${wordId}
            WHERE EXISTS (SELECT id FROM t_word_bundle WHERE id = ${wordBundleId} AND owner_id = ${userId}) AND
                  EXISTS (SELECT id FROM t_word WHERE id = ${wordId} AND owner_id = ${userId}) AND
              NOT EXISTS (SELECT *  FROM t_word_in_bundle WHERE word_bundle_id = ${wordBundleId} AND word_id = ${wordId})"""
        .update.apply
    insertedRowsNumber == 1
  }

  def removeWordFromBundle(wordId: Long, wordBundleId: Long, userId: Long)(implicit session: DBSession): Boolean = {
    val removeRowsNumber =
      sql"""DELETE FROM t_word_in_bundle WHERE word_bundle_id = ${wordBundleId} AND word_id = ${wordId} AND
            1 = (SELECT count(id) FROM t_word_bundle WHERE id = ${wordBundleId} AND owner_id = ${userId})"""
        .update.apply
    removeRowsNumber > 0
  }

}
