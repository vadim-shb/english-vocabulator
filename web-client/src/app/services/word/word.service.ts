import {Injectable} from "@angular/core";
import {Word} from "../../domain/word";
import "rxjs/add/operator/toPromise";
import "rxjs/Rx";
import {Observable, BehaviorSubject} from "rxjs";
import {WordDao} from "../../dao/word/word.dao";

@Injectable()
export class WordService {

  private wordVault = new Map<number, BehaviorSubject<Word>>();

  constructor(private wordDao: WordDao) {
    wordDao.loadFullWordsList()
      .forEach((words: Word[]) => {
        words.forEach(word => this.wordVault.set(word.id, new BehaviorSubject(word)));
      });
  }

  getWord(wordId: number): Observable<Word> {
    let result = this.wordVault.get(wordId);
    if (result) {
      return result;
    } else {
      return this.loadWord(wordId);
    }
  }

  private loadWord(wordId: number): Observable<Word> {
    return this.wordDao.loadWord(wordId)
      .flatMap(word => {
        let result = new BehaviorSubject<Word>(word);
        this.wordVault.set(word.id, result);
        return result;
      });
  }

  addWord(word: Word): Observable<Word> {
    return this.wordDao.addWord(word)
      .flatMap(word => {
        let result = new BehaviorSubject<Word>(word);
        this.wordVault.set(word.id, result);
        return result;
      });
  }

  updateWord(word: Word): void {
    this.wordDao.updateWord(word)
      .subscribe(word => this.wordVault.get(word.id).next(word));
  }

}
