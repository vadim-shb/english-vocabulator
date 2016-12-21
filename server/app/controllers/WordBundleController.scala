package controllers

import javax.inject.Inject

import dao.WordBundleDao
import domain.WordBundle
import persistence.DbConnected
import play.api.libs.json.Json
import play.api.mvc._
import utils.CurrentUserOrForbidden

class WordBundleController @Inject()(
                                      currentUserOrForbidden: CurrentUserOrForbidden,
                                      wordBundleDao: WordBundleDao
                                    ) extends Controller with DbConnected {

  def findWordBundles(userId: Long) = currentUserOrForbidden(userId) {
    Action { implicit request =>
      insideReadOnly { implicit session =>
        Ok(Json.toJson(wordBundleDao.findWordBundles(ownerId = userId)))
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
}