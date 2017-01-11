import {Injectable} from "@angular/core";
import {
  WordKnowledgeTestResumeCreator,
  WordKnowledgeTestType,
  WordKnowledgeTestResultType,
  WordKnowledgeTestResume
} from "../../../domain/word-knowledge-test";
import {Word} from "../../../domain/word";
import {WordBundle} from "../../../domain/word-bundle";
import {WordKnowledgeTestService} from "../../../services/word-knowledge-test/word-knowledge-test.service";
import {WordLearnQueueService} from "../../../services/word-learn-queue/word-learn-queue.service";
import {WordBundleService} from "../../../services/word-bundle/word-bundle.service";
import {Subscription} from "rxjs";

export enum WordLearnStage {
  NO_PICKED_WORD, ASK_KNOW, CHECK_KNOW, VIEW_MEANING
}

@Injectable()
export class LearnService {

  wordBundles: WordBundle[];
  activeWord: Word;
  stage: WordLearnStage = WordLearnStage.NO_PICKED_WORD;
  private testResumeCreator = new WordKnowledgeTestResumeCreator();

  constructor(private wordBundleService: WordBundleService,
              private wordLearnQueueService: WordLearnQueueService,
              private wordKnowledgeTestService: WordKnowledgeTestService) {

    this.wordBundleService.getAllWordBundles().subscribe(wordBundles => {
      this.wordBundles = wordBundles;
      if (wordBundles[0]) {
        this.selectWordBundle(wordBundles[0].id);
      }
    });
  }

  private wordsOfBundleSubscription: Subscription;

  selectWordBundle(wordBundleId) {
    if (this.wordsOfBundleSubscription) {
      this.wordsOfBundleSubscription.unsubscribe();
    }
    this.wordsOfBundleSubscription = this.wordBundleService.getWordsOfWordBundle(wordBundleId).subscribe(words => {
      this.wordLearnQueueService.setWords(words);
      this.activeWord = this.wordLearnQueueService.getNextWord();
      this.stage = WordLearnStage.ASK_KNOW;
      this.testResumeCreator.startTest(this.activeWord, WordKnowledgeTestType.MEANING);
    });
  }

  doNotKnowAnswer() {
    this.testResumeCreator.stopTest();
    let testResume = this.testResumeCreator.buildTestResume(WordKnowledgeTestResultType.DO_NOT_KNOW);
    this.saveTestResume(testResume);
    this.wordLearnQueueService.countAnswer(testResume);
    this.stage = WordLearnStage.VIEW_MEANING;
  }

  doKnowAnswer() {
    this.testResumeCreator.stopTest();
    this.stage = WordLearnStage.CHECK_KNOW;
  }

  selfCheckCorrect() {
    let testResume = this.testResumeCreator.buildTestResume(WordKnowledgeTestResultType.KNOW);
    this.saveTestResume(testResume);
    this.wordLearnQueueService.countAnswer(testResume);
    this.nextWord();
  }

  selfCheckWrong() {
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
