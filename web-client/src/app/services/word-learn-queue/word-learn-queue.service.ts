import {Injectable} from "@angular/core";
import {Word} from "../../domain/word";
import LinkedList from "typescript-collections/dist/lib/LinkedList";
import {WordService} from "../word/word.service";
import {WordKnowledgeTestResume, WordKnowledgeTestResultType} from "../../domain/word-knowledge-test";

@Injectable()
export class WordLearnQueueService {

  private wordsLearnQueue = new LinkedList<LearnableWord>();

  constructor(private wordService: WordService) {
  }

  setWords(words: Word[]): void {
    this.wordsLearnQueue.clear();
    words.sort(Word.wordDecImportanceComparator).forEach(word => this.wordsLearnQueue.add({
      word: word,
      isRepeat: false
    }))
  }

  getNextWord(): Word {
    let result = this.wordsLearnQueue.first();
    this.wordsLearnQueue.removeElementAtIndex(0);
    if (!result.isRepeat) {
      this.wordsLearnQueue.add(result);
    }
    return result.word;
  }

  countAnswer(testResume: WordKnowledgeTestResume) {
    if (testResume.testResult != WordKnowledgeTestResultType.KNOW) {
      if (this.wordsLearnQueue.size() > 4) {
        this.insertWordToLearnQueueById(testResume.wordId, 2);
      }
      if (this.wordsLearnQueue.size() > 9) {
        this.insertWordToLearnQueueById(testResume.wordId, 7);
      }
      if (this.wordsLearnQueue.size() > 20) {
        this.insertWordToLearnQueueById(testResume.wordId, 15);
      }
    }
  }

  private insertWordToLearnQueueById(wordId: number, position: number) {
    this.wordService.getWord(wordId).first().subscribe(word => {
      this.wordsLearnQueue.add({word: word, isRepeat: true}, position);
    });
  }
}

class LearnableWord {
  word: Word;
  isRepeat: boolean;
}
