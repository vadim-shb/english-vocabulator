import {Word} from "./word";
import {WordKnowledgeTestType} from "./enum/word-knowledge-test-type";
import {WordKnowledgeTestResultType} from "./enum/word-knowledge-test-result-type";

export class WordKnowledgeTestResumeDTO {
  id?: number;
  wordId: number;
  testType: string;
  testResult: string;
  testDuration: number;
}

export class WordKnowledgeTestResume {
  id?: number;
  wordId: number;
  testType: WordKnowledgeTestType;
  testResult: WordKnowledgeTestResultType;
  testDuration: number;
}

class BlankWordKnowledgeTestResume {
  id?: number;
  wordId: number;
  testType: WordKnowledgeTestType;
  testResult?: WordKnowledgeTestResultType;
  testDuration?: number;
}

export class WordKnowledgeTestResumeCreator {
  private blankTestResume: BlankWordKnowledgeTestResume;
  private startTestTime: number;

  startTest(word: Word, testType: WordKnowledgeTestType) {
    this.blankTestResume = {
      wordId: word.id,
      testType: testType
    };
    this.startTestTime = Date.now();
  }

  stopTest(): void {
    let stopTestTime = Date.now();
    this.blankTestResume.testDuration = stopTestTime - this.startTestTime;
  }

  buildTestResume(testResult: WordKnowledgeTestResultType): WordKnowledgeTestResume {
    return {
      wordId: this.blankTestResume.wordId,
      testType: this.blankTestResume.testType,
      testResult: testResult,
      testDuration: this.blankTestResume.testDuration
    }
  }
}

