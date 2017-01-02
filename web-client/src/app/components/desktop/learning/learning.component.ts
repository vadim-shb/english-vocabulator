import {Component, OnInit} from "@angular/core";
import {UserService} from "../../../services/user/user.service";
import {WordBundle} from "../../../domain/word-bundle";
import {WordBundleService} from "../../../services/word-bundle/word-bundle.service";
import {EntityUtils} from "../../../utils/entity-utils";
import {Word} from "../../../domain/word";
import {WordLearnQueueService} from "../../../services/word-learn-queue/word-learn-queue.service";
import {WordService} from "../../../services/word/word.service";
import {Observable} from "rxjs";

enum WordLearnStage {
  NO_PICKED_WORD, ASK_KNOW, CHECK_KNOW, VIEW_MEANING
}

@Component({
  selector: 'app-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.less']
})
export class LearningComponent implements OnInit {

  private wordBundles: WordBundle[];
  private activeWord: Word;
  private wordLearnStage = WordLearnStage;
  private stage: WordLearnStage = WordLearnStage.NO_PICKED_WORD;

  constructor(private userService: UserService,
              private wordBundleService: WordBundleService,
              private wordService: WordService,
              private wordLearnQueueService: WordLearnQueueService) {

  }

  ngOnInit() {
    this.userService.signInIfNot();
    this.wordBundleService.getWordBundleIds()
      .subscribe(wordBundleIds => {
        let wordBundleObs = wordBundleIds.map(wordBundleId => this.wordBundleService.getWordBundle(wordBundleId));
        EntityUtils.mergeObservables(wordBundleObs)
          .subscribe((wordBundles: WordBundle[]) => {
            this.wordBundles = wordBundles;
            if (wordBundles[0]) {
              this.selectWordBundle(wordBundles[0].id);
            }
          });
      });
  }

  selectWordBundle(wordBundleId) {
    this.wordBundleService.getWordBundle(wordBundleId)
      .subscribe(wordBundle => {
        let wordObs: Observable<Word>[] = wordBundle.wordIds.map(wordId => this.wordService.getWord(wordId));
        EntityUtils.mergeObservables(wordObs)
          .subscribe((words: Word[]) => {
            this.wordLearnQueueService.setWords(words);
            this.activeWord = this.wordLearnQueueService.getNextWord();
            this.stage = WordLearnStage.ASK_KNOW;
          });
      });
  }

  doKnow() {
    this.stage = WordLearnStage.CHECK_KNOW;
  }

  doNotKnow() {
    this.wordLearnQueueService.countAnswer(this.activeWord, false);
    this.stage = WordLearnStage.VIEW_MEANING;
  }

  checkRight() {
    this.nextWord();
  }

  checkWrong() {
    this.wordLearnQueueService.countAnswer(this.activeWord, false);
    this.nextWord();
  }

  nextWord() {
    this.activeWord = this.wordLearnQueueService.getNextWord();
    this.stage = WordLearnStage.ASK_KNOW;
  }
}
