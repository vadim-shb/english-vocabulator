import {Component, OnInit} from "@angular/core";
import {LearnService, WordLearnStage} from "../../component-services/learn/learn.service";
import {WordKnowledgeTestType} from "../../../domain/enum/word-knowledge-test-type";

@Component({
  selector: 'word-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.less']
})
export class LearnComponent implements OnInit {
  private wordLearnStage = WordLearnStage;
  private wordKnowledgeTestType = WordKnowledgeTestType;

  constructor(private learnService: LearnService) {
  }

  ngOnInit() {
  }

  selectWordBundle(wordBundleId) {
    this.learnService.selectWordBundle(parseInt(wordBundleId));
  }

  selectWordKnowledgeTestType(wordKnowledgeTestType) {
    this.learnService.selectWordKnowledgeTestType(wordKnowledgeTestType);
  }

  doNotKnow() {
    this.learnService.doNotKnowAnswer();
  }

  doKnow() {
    this.learnService.doKnowAnswer();
  }

  selfCheckCorrect() {
    this.learnService.selfCheckCorrect();
  }

  selfCheckWrong() {
    this.learnService.selfCheckWrong();
  }

  nextWord() {
    this.learnService.nextWord();
  }
}
