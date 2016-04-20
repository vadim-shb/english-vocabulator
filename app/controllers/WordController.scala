package controllers

import javax.inject.Inject

import dao.WordDao
import domain.Word
import persistence.DbConnected
import play.api.libs.json.Json
import play.api.mvc._

class WordController @Inject()(wordDao: WordDao) extends Controller with DbConnected {

  def createWord = Action(parse.json) { request =>
    insideLocalTx { implicit session =>
      request.body.asOpt[Word].map(word => {
        Ok(Json.toJson(wordDao.create(word)))
      }).getOrElse(BadRequest)
    }
  }

  def findWords = Action { implicit request =>
    insideReadOnly { implicit session =>
      Ok(Json.toJson(wordDao.findWords))
    }
  }
}