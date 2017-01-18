import {Injectable} from "@angular/core";
import {Word} from "../../domain/word";
import {WordService} from "../word/word.service";
import {WordKnowledgeTestResume, WordKnowledgeTestResultType} from "../../domain/word-knowledge-test";

class WordRepeat {
  word: Word;
  stepsAfterLastFail: number;
  successRepeatTimes: number;
  repeatsQuantity: number;
}

class LearnableWord {
  word: Word;
  stepsAfterLastTest: number;
  successTimes: number;
  failTimes: number;
  index: number;
}

@Injectable()
export class WordLearnQueueService {

  private allImportances = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  private importances = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  // Words are stored in the buckets by importance.
  private wordsToLearn: Array<LearnableWord[]> = [];
  private wordsRepeats: Array<WordRepeat[]> = [];

  private importanceSum :number;
  constructor(private wordService: WordService) {
  }

//======================================================================================================================
//====================================================== setWords ======================================================
//======================================================================================================================

  setWords(words: Word[]): void {
    this.cleanWords();

    words.forEach(word => {
      this.wordsToLearn[word.importance].push({
        word: word,
        stepsAfterLastTest: 0,
        successTimes: 0,
        failTimes: 0,
        index: 1
      });
    });

    this.dropUnusedImportances();
  }

  private cleanWords() {
    this.allImportances.forEach(i => {
      this.wordsToLearn[i] = [];
      this.wordsRepeats[i] = [];
    });
  }

  private dropUnusedImportances() {
    this.importances = this.wordsToLearn
      .filter(bucket => bucket.length > 0)
      .map(bucket => bucket[0].word.importance)
      .filter(importance => importance != 0)  // drop the words with zero importance.
      .sort();
    this.importanceSum = this.importances.reduce((a, b) => a + b);
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
    let importances = this.randomImportanceBucketsQueue();
    console.log(importances);
    for (let i = 0; i < importances.length; i++) {
      let importance = importances[i];
      let wordsToLearn = this.wordsToLearn[importance];
      let randomIndex = Math.floor(Math.random() * (wordsToLearn.length));
      return wordsToLearn[randomIndex].word;
    }
  }

  private tryRepeat(): Word | undefined {
    let importances = this.randomImportanceBucketsQueue();
    for (let i = 0; i < importances.length; i++) {
      let importance = importances[i];
      let wordRepeatsList = this.wordsRepeats[importance];
      for (let j = 0; j < wordRepeatsList.length; j++) {
        let wordRepeat = wordRepeatsList[j];
        if (this.isAppropreateToRepeat(wordRepeat)) {
          return wordRepeat.word;
        }
      }
    }
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



  private randomImportanceBucketsQueue(): number[] {
    let resultImportances = [];
    let leftoverImportances = this.importances.slice();
    let importanceSum = this.importanceSum;
    this.importances.forEach(() => {
      let randomStepImportance = this.chooseRrandomStepImportance(leftoverImportances, importanceSum);
      importanceSum -= randomStepImportance;
      resultImportances.push(randomStepImportance);
      leftoverImportances = leftoverImportances.filter(importance => importance != randomStepImportance);
    });
    return resultImportances;
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
      this.increaseSteps(word);
      if (testResume.testResult != WordKnowledgeTestResultType.KNOW) {
        this.processFail(word);
      } else {
        this.processSuccess(word);
      }
    });
  }

  private increaseSteps(word: Word) {
    this.importances.forEach(i => {
      this.wordsRepeats[i].forEach(wordRepeat => {
        wordRepeat.stepsAfterLastFail++;
      });
      this.wordsToLearn[i].forEach(learnableWord => {
        if (learnableWord.word.id === word.id) {
          learnableWord.stepsAfterLastTest = 0;
        } else {
          learnableWord.stepsAfterLastTest++;
        }
      });
    });
  }

  private getLearnableWord(word: Word): LearnableWord | undefined {
    return this.wordsToLearn[word.importance]
      .filter(wordToLearn => wordToLearn.word.id === word.id)
      .pop()
  }

  private getWordRepeat(word: Word): WordRepeat | undefined {
    return this.wordsRepeats[word.importance]
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
    let index = this.wordsRepeats[wordRepeat.word.importance].indexOf(wordRepeat);
    this.wordsRepeats[wordRepeat.word.importance].splice(index, 1);
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
      this.wordsRepeats[word.importance].push({
        word: word,
        stepsAfterLastFail: 0,
        successRepeatTimes: 0,
        repeatsQuantity: 3
      })
    }
  }

}
