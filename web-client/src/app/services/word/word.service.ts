import {Injectable} from "@angular/core";
import {Word} from "../../domain/word";
import "rxjs/add/operator/toPromise";
import "rxjs/Rx";
import {Observable, ReplaySubject} from "rxjs";
import {WordDao} from "../../dao/word/word.dao";

@Injectable()
export class WordService {

  private wordVault = new Map<number, ReplaySubject<Word>>();

  constructor(private wordDao: WordDao) {
    wordDao.loadFullWordsList()
      .subscribe((words: Word[]) => {
        words.forEach(word => {
          let wordObs = new ReplaySubject<Word>(1);
          wordObs.next(word);
          this.wordVault.set(word.id, wordObs);
        });
      });
  }

  getWord(wordId: number): Observable<Word> {
    let cachedWordObs = this.wordVault.get(wordId);
    if (cachedWordObs) {
      return cachedWordObs;
    } else {
      return this.loadWord(wordId);
    }
  }

  private loadWord(wordId: number): Observable<Word> {
    return this.wordDao.loadWord(wordId)
      .flatMap(word => {
        let cachedWordObs = this.wordVault.get(word.id);
        if (cachedWordObs) {
          cachedWordObs.next(word);
          return cachedWordObs;
        } else {
          let newWordObs = new ReplaySubject<Word>(1);
          newWordObs.next(word);
          this.wordVault.set(word.id, newWordObs);
          return newWordObs;
        }
      });
  }

  addWord(word: Word): Observable<Word> {
    let newWordObs = new ReplaySubject<Word>(1);
    this.wordDao.addWord(word)
      .subscribe(word => {
        this.wordVault.set(word.id, newWordObs);
        newWordObs.next(word)
      });
    return newWordObs;
  }

  updateWord(word: Word): void {
    this.wordDao.updateWord(word)
      .subscribe(word => this.wordVault.get(word.id).next(word));
  }

}
