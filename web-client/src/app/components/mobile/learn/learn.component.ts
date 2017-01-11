import {Component, OnInit} from "@angular/core";
import {LearnService, WordLearnStage} from "../../component-services/learn/learn.service";

@Component({
  selector: 'word-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.less']
})
export class LearnComponent implements OnInit {
  private wordLearnStage = WordLearnStage;

  constructor(private learnService: LearnService) {
  }

  ngOnInit() {
  }

  selectWordBundle(wordBundleId) {
    this.learnService.selectWordBundle(parseInt(wordBundleId));
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
