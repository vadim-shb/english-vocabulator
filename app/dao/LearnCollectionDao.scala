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
      userId = rs.longOpt("user_id"),
      name = rs.string("name")
    )
  }

  def findLearnCollectionOfUser(userId: Long)(implicit session: DBSession) = {
    sql"SELECT * FROM t_word_learn_collection WHERE user_id = ${userId}"
      .map(learnCollectionMapper).list.apply
  }

  def create(learnCollection: LearnCollection)(implicit session: DBSession) = {
    val persistedLearnCollectionId =
      sql"""INSERT INTO t_word_learn_collection(
          user_id,
          name
         ) VALUES (
          ${learnCollection.userId},
          ${learnCollection.name}
         )"""
        .updateAndReturnGeneratedKey.apply

    learnCollection.copy(id = Some(persistedLearnCollectionId))
  }

}