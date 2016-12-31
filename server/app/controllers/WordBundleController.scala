package controllers

import javax.inject.Inject

import dao.{WordBundleDao, WordDao}
import domain.WordBundle
import persistence.DbConnected
import play.api.libs.json.Json
import play.api.mvc._
import utils.CurrentUserOrForbidden

class WordBundleController @Inject()(
                                      currentUserOrForbidden: CurrentUserOrForbidden,
                                      wordBundleDao: WordBundleDao,
                                      wordDao: WordDao
                                    ) extends Controller with DbConnected {

  def findWordBundles(userId: Long) = currentUserOrForbidden(userId) {
    Action { implicit request =>
      insideReadOnly { implicit session =>
        Ok(Json.toJson(wordBundleDao.findWordBundles(ownerId = userId)))
      }
    }
  }

  def findWordBundle(userId: Long, wordBundleId: Long) = currentUserOrForbidden(userId) {
    Action { implicit request =>
      insideReadOnly { implicit session =>
        Ok(Json.toJson(wordBundleDao.findWordBundle(wordBundleId, ownerId = userId)))
      }
    }
  }

  def createWordBundle(userId: Long) = currentUserOrForbidden(userId) {
    Action(parse.json) { request =>
      insideLocalTx { implicit session =>
        request.body.asOpt[WordBundle].map(wordBundle => {
          Ok(Json.toJson(wordBundleDao.create(wordBundle, userId)))
        }).getOrElse(BadRequest)
      }
    }
  }

  def updateWordBundle(userId: Long, wordBundleId: Long) = currentUserOrForbidden(userId) {
    Action(parse.json) { request =>
      insideLocalTx { implicit session =>
        request.body.asOpt[WordBundle].map(wordBundle => {
          if (wordBundle.id.exists(_ != wordBundleId)) {
            BadRequest
          } else {
            wordBundleDao.findWordBundle(wordBundleId, ownerId = userId)
              .map(persistedWordBundle => {
                Ok(Json.toJson(wordBundleDao.update(wordBundle, userId)))
              }).getOrElse(NotFound)
          }
        }).getOrElse(BadRequest)
      }
    }
  }

  def deleteWordBundle(userId: Long, wordBundleId: Long) = currentUserOrForbidden(userId) {
    Action { implicit request =>
      insideLocalTx { implicit session =>
        if (wordBundleDao.removeWordBundle(wordBundleId = wordBundleId, userId = userId)) {
          Ok
        } else {
          NotFound
        }
      }
    }
  }

  def addWordToBundle(userId: Long, wordBundleId: Long, wordId: Long) = currentUserOrForbidden(userId) {
    Action { implicit request =>
      insideLocalTx { implicit session =>
        if (wordBundleDao.addWordToBundle(wordId, wordBundleId, userId)) {
          Ok
        } else {
          NotFound
        }
      }
    }
  }

  def removeWordFromBundle(userId: Long, wordBundleId: Long, wordId: Long) = currentUserOrForbidden(userId) {
    Action { implicit request =>
      insideLocalTx { implicit session =>
        if (wordBundleDao.removeWordFromBundle(wordId = wordId, wordBundleId = wordBundleId, userId = userId)) {
          Ok
        } else {
          NotFound
        }
      }
    }
  }

}