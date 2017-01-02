import {Injectable} from "@angular/core";
import {WordKnowledgeTestDao} from "../../dao/learning/word-knowledge-test.dao";
import {WordKnowledgeTestResume} from "../../domain/word-knowledge-test";

@Injectable()
export class WordKnowledgeTestService {

  constructor(private testDao: WordKnowledgeTestDao) {
  }

  saveWordKnowledgeTestResume(testResume: WordKnowledgeTestResume): void {
    this.testDao.addWordKnowledgeTestResume(testResume)
      .subscribe();
  }
}
