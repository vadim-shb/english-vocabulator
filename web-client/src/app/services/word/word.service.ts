import {Injectable} from "@angular/core";
import {Word} from "../../domain/word";
import "rxjs/add/operator/toPromise";
import "rxjs/Rx";
import {Observable, ReplaySubject, Subscription} from "rxjs";
import {WordDao} from "../../dao/word/word.dao";
import {EntityUtils} from "../../utils/entity-utils";

@Injectable()
export class WordService {

  private wordVault = new Map<number, ReplaySubject<Word>>();
  private allWordIds = new ReplaySubject<number[]>(1);
  private allWords = new ReplaySubject<Word[]>(1);
  private allWordsByIdSubscription: Subscription;

  constructor(private wordDao: WordDao) {
    this.wordDao.loadFullWordsList()
      .subscribe((words: Word[]) => {
        words.forEach(word => {
          let wordObs = new ReplaySubject<Word>(1);
          wordObs.next(word);
          this.wordVault.set(word.id, wordObs);
        });
        this.allWordIds.next(Array.from(this.wordVault.keys()));
      });
    this.allWordIds.subscribe(wordIds => {
      if (this.allWordsByIdSubscription) this.allWordsByIdSubscription.unsubscribe();
      this.allWordsByIdSubscription = this.getWordsByIds(wordIds).subscribe(words => {
        this.allWords.next(words);
      });
    });
  }

  getAllWords(): Observable<Word[]> {
    return this.allWords;
  }

  getAllWordIds(): Observable<number[]> {
    return this.allWordIds;
  }

  getWordsByIds(wordIds: number[]): Observable<Word[]> {
    let wordObservables: Observable<Word>[] = wordIds.map(wordId => this.getWord(wordId));
    return EntityUtils.mergeObservables(wordObservables);
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
        newWordObs.next(word);
        this.allWordIds.first().subscribe(wordIds => {
          wordIds.push(word.id);
          this.allWordIds.next(wordIds);
        });
      });
    return newWordObs;
  }

  updateWord(word: Word): void {
    this.wordDao.updateWord(word)
      .subscribe(word => this.wordVault.get(word.id).next(word));
  }
}
