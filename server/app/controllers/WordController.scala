package controllers

import javax.inject.Inject

import dao.WordDao
import domain.Word
import persistence.DbConnected
import play.api.libs.json.Json
import play.api.mvc._
import utils.CurrentUserOrForbidden

class WordController @Inject()(
                                currentUserOrForbidden: CurrentUserOrForbidden,
                                wordDao: WordDao
                              ) extends Controller with DbConnected {

  def findWords(userId: Long) = currentUserOrForbidden(userId) {
    Action { implicit request =>
      insideReadOnly { implicit session =>
        Ok(Json.toJson(wordDao.findWords(ownerId = userId)))
      }
    }
  }

  def findWord(userId: Long, wordId: Long) = currentUserOrForbidden(userId) {
    Action { implicit request =>
      insideReadOnly { implicit session =>
        wordDao.findWord(wordId, ownerId = userId)
          .map(word => Ok(Json.toJson(word)))
          .getOrElse(NotFound)
      }
    }
  }

  def createWord(userId: Long) = currentUserOrForbidden(userId) {
    Action(parse.json) { request =>
      insideLocalTx { implicit session =>
        request.body.asOpt[Word].map(word => {
          Ok(Json.toJson(wordDao.create(word, userId)))
        }).getOrElse(BadRequest)
      }
    }
  }

  def updateWord(userId: Long, wordId: Long) = currentUserOrForbidden(userId) {
    Action(parse.json) { request =>
      insideLocalTx { implicit session =>
        request.body.asOpt[Word].map(word => {
          if (word.id.exists(_ != wordId)) {
            BadRequest
          } else {
            wordDao.findWord(wordId, ownerId = userId).map(persistedWord => {
              wordDao.update(word)
              Ok
            }).getOrElse(NotFound)
          }
        }).getOrElse(BadRequest)
      }
    }
  }
}