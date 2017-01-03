package controllers

import javax.inject.Inject

import dao.WordKnowledgeTestResumeDao
import domain.WordKnowledgeTestResume
import persistence.DbConnected
import play.api.libs.json.Json
import play.api.mvc._
import utils.CurrentUserOrForbidden

class WordKnowledgeTestResumeController @Inject()(
                                                   currentUserOrForbidden: CurrentUserOrForbidden,
                                                   wordKnowledgeTestResumeDao: WordKnowledgeTestResumeDao
                                                 ) extends Controller with DbConnected {

  def addWordKnowledgeTestResume(userId: Long) = currentUserOrForbidden(userId) {
    Action(parse.json) { implicit request =>
      request.body.asOpt[WordKnowledgeTestResume].map(testResume => {
        insideLocalTx { implicit session =>
          Ok(Json.toJson(wordKnowledgeTestResumeDao.addWordKnowledgeTestResume(testResume, userId)))
        }
      }).getOrElse(BadRequest)
    }
  }

}
