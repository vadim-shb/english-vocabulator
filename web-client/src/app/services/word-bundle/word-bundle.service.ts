import {Injectable} from "@angular/core";
import {Observable, ReplaySubject} from "rxjs";
import {WordBundle} from "../../domain/word-bundle";
import {WordBundleDao} from "../../dao/word-bundle/word-bundle.dao";
import {Word} from "../../domain/word";

@Injectable()
export class WordBundleService {

  private wordBundlesVault = new Map<number, ReplaySubject<WordBundle>>();
  private wordBundleIds = new Set<number>();
  private wordBundleIdsSubj = new ReplaySubject<number[]>(1);

  constructor(private wordBundleDao: WordBundleDao) {
    this.wordBundleDao.loadFullWordBundleList()
      .subscribe((wordBundles: WordBundle[]) => {
        this.wordBundleIdsSubj.next(wordBundles.map(wordBundle => wordBundle.id));
        wordBundles.forEach((wordBundle: WordBundle) => {
          let cashedObservable = this.wordBundlesVault.get(wordBundle.id);
          if (cashedObservable) {
            cashedObservable.next(wordBundle);
          } else {
            let wordBundleSubject = new ReplaySubject<WordBundle>(1);
            wordBundleSubject.next(wordBundle);
            this.wordBundlesVault.set(wordBundle.id, wordBundleSubject);
          }
        });
      });
    this.wordBundleIdsSubj.subscribe(wordBundleIds => {
      this.wordBundleIds.clear();
      wordBundleIds.forEach(wordBundleId => this.wordBundleIds.add(wordBundleId));
    });
  }

  getWordBundleIds(): Observable<number[]> {
    return this.wordBundleIdsSubj;
  }

  getWordBundle(wordBundleId: number): Observable<WordBundle> {
    let cashedObservable = this.wordBundlesVault.get(wordBundleId);
    if (cashedObservable) {
      return cashedObservable;
    } else {
      let newObservable = new ReplaySubject<WordBundle>(1);
      this.wordBundlesVault.set(wordBundleId, newObservable);
      this.wordBundleDao.loadWordBundle(wordBundleId)
        .subscribe(wordBundle => newObservable.next(wordBundle));
      return newObservable;
    }
  }

  addWordBundle(wordBundle: WordBundle): void {
    this.wordBundleDao.addWordBundle(wordBundle)
      .subscribe(wordBundle => {
        let wordBundleSubject = new ReplaySubject<WordBundle>(1);
        wordBundleSubject.next(wordBundle);
        this.wordBundlesVault.set(wordBundle.id, wordBundleSubject);
        this.wordBundleIds.add(wordBundle.id);
        this.wordBundleIdsSubj.next(Array.from(this.wordBundleIds.values()));
      });
  }

  updateWordBundle(wordBundle: WordBundle): void {
    this.wordBundleDao.updateWordBundle(wordBundle)
      .subscribe(updatedWordBundle => {
        this.wordBundlesVault.get(updatedWordBundle.id)
          .next(updatedWordBundle);
      });
  }

  bindWordToBundle(wordBundle: WordBundle, word: Word): void {
    this.wordBundleDao.addWordToBundle(wordBundle.id, word.id)
      .subscribe(() => {
        this.reloadWordBundle(wordBundle.id);
      });
  }

  unbindWordFromBundle(wordBundle: WordBundle, word: Word): void {
    this.wordBundleDao.removeWordFromBundle(wordBundle.id, word.id)
      .subscribe(() => {
        this.reloadWordBundle(wordBundle.id);
      });
  }

  private reloadWordBundle(wordBundleId: number) {
    this.wordBundleDao.loadWordBundle(wordBundleId)
      .subscribe(wordBundle => {
        this.wordBundlesVault.get(wordBundle.id).next(wordBundle);
      });
  }

  removeWordBundle(wordBundleId: number): Observable<any> {
    return this.wordBundleDao.removeWordBundle(wordBundleId)
      .map(() => {
        this.wordBundlesVault.delete(wordBundleId);
        this.wordBundleIds.delete(wordBundleId);
        this.wordBundleIdsSubj.next(Array.from(this.wordBundleIds.values()));
      });
  }

}
