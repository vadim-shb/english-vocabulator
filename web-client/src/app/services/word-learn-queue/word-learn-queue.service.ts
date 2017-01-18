import {Injectable} from "@angular/core";
import {Word} from "../../domain/word";
import {WordService} from "../word/word.service";
import {WordKnowledgeTestResume, WordKnowledgeTestResultType} from "../../domain/word-knowledge-test";

class WordRepeat {
  word: Word;
  stepsAfterLastFail: number;
  successRepeatTimes: number;
  repeatsQuantity: number;
  repeatImportanceIndex: number;
}

class LearnableWord {
  word: Word;
  stepsAfterLastTest: number;
  successTimes: number;
  failTimes: number;
  learnImportanceIndex: number;
}

@Injectable()
export class WordLearnQueueService {

  private wordsToLearn: Array<LearnableWord> = [];
  private wordsRepeats: Array<WordRepeat> = [];

  constructor(private wordService: WordService) {
  }

  private lastTestedWords = {
    lastWordId: 0,
    beforeLastWordId: 0
  };

//======================================================================================================================
//====================================================== setWords ======================================================
//======================================================================================================================

  setWords(words: Word[]): void {
    this.cleanWords();

    words.forEach(word => {
      this.wordsToLearn.push({
        word: word,
        stepsAfterLastTest: 0,
        successTimes: 0,
        failTimes: 0,
        learnImportanceIndex: 1
      });
    });
  }

  private cleanWords() {
    this.wordsToLearn = [];
    this.wordsRepeats = [];
  }

//======================================================================================================================
//===================================================== getNextWord ====================================================
//======================================================================================================================

  getNextWord(): Word {
    if (this.trueWithChance(75)) {
      let word = this.tryRepeat();
      if (word) {
        return word
      }
    }
    return this.getWordToLearn();
  }

  private getWordToLearn(): Word {
    this.sortWordsToLearnImportance();

    for (let i = 0; i < this.wordsToLearn.length; i++) {
      if (this.trueWithChance(70)) {
        if (this.checkIfNotOneOfLastWords(this.wordsToLearn[i].word)) {
          return this.wordsToLearn[i].word;
        }
      }
    }
    // the same, but drop 70% chances
    for (let i = 0; i < this.wordsToLearn.length; i++) {
      if (this.checkIfNotOneOfLastWords(this.wordsToLearn[i].word)) {
        return this.wordsToLearn[i].word;
      }
    }
  }

  private tryRepeat(): Word | undefined {
    this.sortWordsRepeatsByImportance();

    for (let i = 0; i < this.wordsRepeats.length; i++) {
      let wordRepeat = this.wordsRepeats[i];
      if (this.checkIfNotOneOfLastWords(wordRepeat.word)) {
        if (this.isAppropreateToRepeat(wordRepeat)) {
          return wordRepeat.word;
        }
      }
    }
  }

  private sortWordsToLearnImportance(): void {
    this.wordsToLearn.sort((learnableWord1, learnableWord2) => {
      return learnableWord2.learnImportanceIndex - learnableWord1.learnImportanceIndex
    });
  }

  private sortWordsRepeatsByImportance(): void {
    this.wordsRepeats.sort((wordRepeat1, wordRepeat2) => {
      return wordRepeat2.repeatImportanceIndex - wordRepeat1.repeatImportanceIndex
    });
  }

  private checkIfNotOneOfLastWords(word: Word): boolean {
    if (this.wordsToLearn.length >= 3) {
      return word.id != this.lastTestedWords.lastWordId && word.id != this.lastTestedWords.beforeLastWordId;
    }
    if (this.wordsToLearn.length >= 2) {
      return word.id != this.lastTestedWords.lastWordId;
    }
    return true;
  }

  private isAppropreateToRepeat(wordRepeat: WordRepeat): boolean {
    if (wordRepeat.stepsAfterLastFail > 2 * wordRepeat.successRepeatTimes) {
      if (this.trueWithChance(55)) return true;
    }
    if (wordRepeat.stepsAfterLastFail > 3 * wordRepeat.successRepeatTimes) {
      if (this.trueWithChance(80)) return true;
    }
    if (wordRepeat.stepsAfterLastFail > 4 * wordRepeat.successRepeatTimes) {
      return true;
    }
    return false;
  }

  private trueWithChance(chancePerCent: number): boolean {
    return (Math.random() * 100) < chancePerCent;
  }

  private chooseRrandomStepImportance(importances, importanceSum): number {
    let rand = Math.random();
    let border = 0;
    for (let i = 0; i < importances.length; i++) {
      let importance = importances[i];
      border += importance / importanceSum;
      if (rand < border) {
        return importance;
      }
    }
    return importances.slice(-1).pop(); // last element
  }

//======================================================================================================================
//===================================================== countAnswer ====================================================
//======================================================================================================================

  countAnswer(testResume: WordKnowledgeTestResume) {
    this.wordService.getWord(testResume.wordId).first().subscribe(word => {
      this.changeLastTestedWords(word.id);
      this.increaseSteps(word);
      if (testResume.testResult != WordKnowledgeTestResultType.KNOW) {
        this.processFail(word);
      } else {
        this.processSuccess(word);
      }
      this.recalculateIndexes();
    });
  }

  private recalculateIndexes() {
    this.wordsToLearn.forEach(wordToLearn => {
      this.recalculateLearnImportanceIndex(wordToLearn, this.wordsToLearn.length);
    });
    // (!) repeatImportanceIndex depends on learnImportanceIndex
    this.wordsRepeats.forEach(wordRepeat => {
      this.recalculateRepeatImportanceIndex(wordRepeat);
    });
  }

  private recalculateLearnImportanceIndex(learnableWord: LearnableWord, wordListLength: number): void {
    let stepsIndex = learnableWord.stepsAfterLastTest - 0.9 * wordListLength;
    if (stepsIndex < 1) stepsIndex = 1;

    let failIndex = (learnableWord.failTimes + 3) * 4 - learnableWord.successTimes;
    if (failIndex < 1) failIndex = 0.5; // word is learned.

    learnableWord.learnImportanceIndex = learnableWord.word.importance * stepsIndex * failIndex;
  }

  private recalculateRepeatImportanceIndex(wordRepeat: WordRepeat): void {
    let learnableWord = this.getLearnableWord(wordRepeat.word);
    let learnImportanceIndex = learnableWord.learnImportanceIndex;

    let stepsAfterFailIndex = 1;

    if (wordRepeat.stepsAfterLastFail >= 3) {
      stepsAfterFailIndex = wordRepeat.stepsAfterLastFail;
    }
    if (wordRepeat.stepsAfterLastFail >= 6) {
      stepsAfterFailIndex = wordRepeat.stepsAfterLastFail / 1.5;
    }
    if (wordRepeat.stepsAfterLastFail >= 9) {
      stepsAfterFailIndex = wordRepeat.stepsAfterLastFail / 2;
    }

    let successRepeatsIndex;
    if (wordRepeat.successRepeatTimes === 0) {
      successRepeatsIndex = 2;
    }
    if (wordRepeat.successRepeatTimes === 1) {
      successRepeatsIndex = 1 / 2;
    }
    if (wordRepeat.successRepeatTimes === 2) {
      successRepeatsIndex = 1 / 4;
    }
    if (wordRepeat.successRepeatTimes === 3) {
      successRepeatsIndex = 1 / 7;
    }
    if (wordRepeat.successRepeatTimes >= 4) {
      successRepeatsIndex = 1 / 10;
    }

    wordRepeat.repeatImportanceIndex = learnImportanceIndex * stepsAfterFailIndex * successRepeatsIndex;
  }

  private changeLastTestedWords(testedWordId) {
    this.lastTestedWords.beforeLastWordId = this.lastTestedWords.lastWordId;
    this.lastTestedWords.lastWordId = testedWordId;
  }

  private increaseSteps(word: Word) {
    this.wordsRepeats.forEach(wordRepeat => {
      wordRepeat.stepsAfterLastFail++;
    });
    this.wordsToLearn.forEach(learnableWord => {
      if (learnableWord.word.id === word.id) {
        learnableWord.stepsAfterLastTest = 0;
      } else {
        learnableWord.stepsAfterLastTest++;
      }
    });
  }

  private getLearnableWord(word: Word): LearnableWord | undefined {
    return this.wordsToLearn
      .filter(wordToLearn => wordToLearn.word.id === word.id)
      .pop()
  }

  private getWordRepeat(word: Word): WordRepeat | undefined {
    return this.wordsRepeats
      .filter(wordRepeat => wordRepeat.word.id === word.id)
      .pop()
  }

  private processSuccess(word: Word) {
    let learnableWord = this.getLearnableWord(word);
    if (learnableWord) {
      learnableWord.successTimes++
    }

    let wordRepeat = this.getWordRepeat(word);
    if (wordRepeat) {
      wordRepeat.successRepeatTimes += 1;
      wordRepeat.repeatsQuantity -= 1;
      if (wordRepeat.repeatsQuantity <= 0) {
        this.removeWordRepeat(wordRepeat);
      }
    }
  }

  private removeWordRepeat(wordRepeat: WordRepeat) {
    let index = this.wordsRepeats.indexOf(wordRepeat);
    this.wordsRepeats.splice(index, 1);
  }

  private processFail(word: Word) {
    let learnableWord = this.getLearnableWord(word);
    if (learnableWord) {
      learnableWord.failTimes++
    }

    let wordRepeat = this.getWordRepeat(word);
    if (wordRepeat) {
      wordRepeat.stepsAfterLastFail = 0;
      wordRepeat.successRepeatTimes = 0;
      wordRepeat.repeatsQuantity += 2;

    } else {
      this.wordsRepeats.push({
        word: word,
        stepsAfterLastFail: 0,
        successRepeatTimes: 0,
        repeatsQuantity: 3,
        repeatImportanceIndex: 0
      })
    }
  }

}
