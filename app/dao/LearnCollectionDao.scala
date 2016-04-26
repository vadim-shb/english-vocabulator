package dao

import javax.inject.{Inject, Singleton}

import domain.LearnCollection
import persistence.DbConnected
import scalikejdbc._

@Singleton
class LearnCollectionDao @Inject()(wordMeaningDao: WordMeaningDao) extends DbConnected {

  private def learnCollectionMapper(rs: WrappedResultSet)(implicit session: DBSession) = {
    LearnCollection(
      id = Some(rs.long("id")),
      ownerId = rs.longOpt("owner_id"),
      name = rs.string("name")
    )
  }

  def findLearnCollectionsOfUser(userId: Long)(implicit session: DBSession) = {
    sql"SELECT * FROM t_learn_collection WHERE owner_id = ${userId}"
      .map(learnCollectionMapper).list.apply
  }

  def findLearnCollectionOfUser(ownerId: Long, learnCollectionId: Long)(implicit session: DBSession) = {
    sql"SELECT * FROM t_learn_collection WHERE id = ${learnCollectionId} AND owner_id = ${ownerId}"
      .map(learnCollectionMapper).single.apply
  }

  def create(learnCollection: LearnCollection)(implicit session: DBSession) = {
    val persistedLearnCollectionId =
      sql"""INSERT INTO t_learn_collection(
          owner_id,
          name
         ) VALUES (
          ${learnCollection.ownerId},
          ${learnCollection.name}
         )"""
        .updateAndReturnGeneratedKey.apply

    learnCollection.copy(id = Some(persistedLearnCollectionId))
  }

  def addWordToLearnCollection(wordAndLearnCollectionOwnerId: Long, wordId: Long, learnCollectionId: Long)(implicit session: DBSession) = {
    sql"""SELECT add_word_to_learn_collection(${wordAndLearnCollectionOwnerId}, ${wordId}, ${learnCollectionId})"""
      .execute.apply
  }

  def deleteWordFromLearnCollection(wordAndLearnCollectionOwnerId: Long, wordId: Long, learnCollectionId: Long)(implicit session: DBSession) = {
    sql"""SELECT delete_word_from_learn_collection(${wordAndLearnCollectionOwnerId}, ${wordId}, ${learnCollectionId})"""
      .execute.apply
  }
}