package controllers

import javax.inject.Inject

import dao.{LearnCollectionDao, WordDao}
import domain.LearnCollection
import persistence.DbConnected
import play.api.libs.json.Json
import play.api.mvc._
import service.SecurityService
import utils.CurrentUserOrForbidden

class LearnCollectionController @Inject()(
                                           currentUserOrForbidden: CurrentUserOrForbidden,
                                           learnCollectionDao: LearnCollectionDao,
                                           wordDao: WordDao,
                                           securityService: SecurityService
                                         ) extends Controller with DbConnected {

  def createLearnCollection(userId: Long) = currentUserOrForbidden(userId) { Action(parse.json) { implicit request =>
    request.body.asOpt[LearnCollection].map(learnCollection => {
      insideLocalTx { implicit session =>
        Ok(Json.toJson(learnCollectionDao.create(learnCollection.copy(ownerId = Some(userId)))))
      }
    }).getOrElse(BadRequest)
  }}

  def findLearnCollections(userId: Long) = currentUserOrForbidden(userId) { Action { implicit request =>
    insideReadOnly { implicit session =>
      Ok(Json.toJson(learnCollectionDao.findLearnCollectionsOfUser(userId)))
    }
  }}

  def findLearnCollection(userId: Long, learnCollectionId: Long) = currentUserOrForbidden(userId) { Action { implicit request =>
    insideReadOnly { implicit session =>
      learnCollectionDao.findLearnCollectionOfUser(ownerId = userId, learnCollectionId = learnCollectionId).map(learnCollection => {
        Ok(Json.obj(
          "learnCollection" -> Json.toJson(learnCollection),
          "wordsInLearnCollection" -> Json.toJson(wordDao.findWordsInLearnCollection(learnCollectionId))
        ))
      }).getOrElse(NotFound)
    }
  }}

  def addWordToLearnCollection(userId: Long, learnCollectionId: Long, wordId: Long) = currentUserOrForbidden(userId) { Action { implicit request =>
    insideLocalTx { implicit session =>
      learnCollectionDao.addWordToLearnCollection(wordAndLearnCollectionOwnerId = userId, wordId = wordId, learnCollectionId = learnCollectionId)
      Ok
    }
  }}

  def removeWordFromLearnCollection(userId: Long, learnCollectionId: Long, wordId: Long)  = currentUserOrForbidden(userId) { Action { implicit request =>
    insideLocalTx { implicit session =>
      learnCollectionDao.deleteWordFromLearnCollection(wordAndLearnCollectionOwnerId = userId, wordId = wordId, learnCollectionId = learnCollectionId)
      Ok
    }
  }}
}
