package controllers

import javax.inject.Inject

import dao.LearnCollectionDao
import domain.LearnCollection
import persistence.DbConnected
import play.api.libs.json.Json
import play.api.mvc._
import service.SecurityService
import utils.CurrentUserOrForbidden

class LearnCollectionController @Inject()(currentUserOrForbidden: CurrentUserOrForbidden, learnCollectionDao: LearnCollectionDao, securityService: SecurityService) extends Controller with DbConnected {

  def createLearnCollection(userId: Long) = currentUserOrForbidden(userId) { Action(parse.json) { implicit request =>
    request.body.asOpt[LearnCollection].map(learnCollection => {
      insideLocalTx { implicit session =>
        Ok(Json.toJson(learnCollectionDao.create(learnCollection.copy(userId = Some(userId)))))
      }
    }).getOrElse(BadRequest)
  }}

  def findLearnCollections(userId: Long) = currentUserOrForbidden(userId) { Action { implicit request =>
    insideReadOnly { implicit session =>
      Ok(Json.toJson(learnCollectionDao.findLearnCollectionOfUser(userId)))
    }
  }}
}
