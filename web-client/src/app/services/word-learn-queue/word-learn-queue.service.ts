import {Injectable} from "@angular/core";
import {Word} from "../../domain/word";
import LinkedList from "typescript-collections/dist/lib/LinkedList";

@Injectable()
export class WordLearnQueueService {

  private words = new LinkedList<LearnableWord>();

  constructor() {
  }

  setWords(words: Word[]): void {
    this.words.clear();
    words.sort(Word.wordDecImportanceComparator).forEach(word => this.words.add({word: word, isRepeat: false}))
  }

  getNextWord(): Word {
    let result = this.words.first();
    this.words.removeElementAtIndex(0);
    if (!result.isRepeat) {
      this.words.add(result);
    }
    return result.word;
  }

  countAnswer(word: Word, isRight: boolean) {
    if (!isRight) {
      if (this.words.size() > 4) {
        this.words.add({word: word, isRepeat: true}, 2);
      }
      if (this.words.size() > 9) {
        this.words.add({word: word, isRepeat: true}, 7);
      }
      if (this.words.size() > 20) {
        this.words.add({word: word, isRepeat: true}, 15);
      }
    }
  }
}

class LearnableWord {
  word: Word;
  isRepeat: boolean;
}
