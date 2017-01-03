import {Component, OnInit} from "@angular/core";
import {UserService} from "../../../services/user/user.service";
import {WordBundle} from "../../../domain/word-bundle";
import {WordBundleService} from "../../../services/word-bundle/word-bundle.service";
import {EntityUtils} from "../../../utils/entity-utils";
import {Word} from "../../../domain/word";
import {WordLearnQueueService} from "../../../services/word-learn-queue/word-learn-queue.service";
import {WordService} from "../../../services/word/word.service";
import {Observable} from "rxjs";
import {
  WordKnowledgeTestResumeCreator,
  WordKnowledgeTestType,
  WordKnowledgeTestResultType,
  WordKnowledgeTestResume
} from "../../../domain/word-knowledge-test";
import {WordKnowledgeTestService} from "../../../services/word-knowledge-test/word-knowledge-test.service";

enum WordLearnStage {
  NO_PICKED_WORD, ASK_KNOW, CHECK_KNOW, VIEW_MEANING
}

@Component({
  selector: 'word-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.less']
})
export class LearnComponent implements OnInit {

  private wordBundles: WordBundle[];
  private activeWord: Word;
  private wordLearnStage = WordLearnStage;
  private stage: WordLearnStage = WordLearnStage.NO_PICKED_WORD;
  private testResumeCreator = new WordKnowledgeTestResumeCreator();

  constructor(private userService: UserService,
              private wordBundleService: WordBundleService,
              private wordService: WordService,
              private wordLearnQueueService: WordLearnQueueService,
              private wordKnowledgeTestService: WordKnowledgeTestService) {

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
            this.testResumeCreator.startTest(this.activeWord, WordKnowledgeTestType.MEANING);
          });
      });
  }

  doNotKnow() {
    this.testResumeCreator.stopTest();
    let testResume = this.testResumeCreator.buildTestResume(WordKnowledgeTestResultType.DO_NOT_KNOW);
    this.saveTestResume(testResume);
    this.wordLearnQueueService.countAnswer(testResume);
    this.stage = WordLearnStage.VIEW_MEANING;
  }

  doKnow() {
    this.testResumeCreator.stopTest();
    this.stage = WordLearnStage.CHECK_KNOW;
  }

  checkRight() {
    let testResume = this.testResumeCreator.buildTestResume(WordKnowledgeTestResultType.KNOW);
    this.saveTestResume(testResume);
    this.wordLearnQueueService.countAnswer(testResume);
    this.nextWord();
  }

  checkWrong() {
    let testResume = this.testResumeCreator.buildTestResume(WordKnowledgeTestResultType.KNOW_FAIL);
    this.saveTestResume(testResume);
    this.wordLearnQueueService.countAnswer(testResume);
    this.nextWord();
  }

  private saveTestResume(testResume: WordKnowledgeTestResume) {
    this.wordKnowledgeTestService.saveWordKnowledgeTestResume(testResume);
  }

  nextWord() {
    this.activeWord = this.wordLearnQueueService.getNextWord();
    this.stage = WordLearnStage.ASK_KNOW;
    this.testResumeCreator.startTest(this.activeWord, WordKnowledgeTestType.MEANING);
  }
}
