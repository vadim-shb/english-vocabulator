import {Injectable} from "@angular/core";
import {Observable, BehaviorSubject} from "rxjs";
import {WordBundle} from "../../domain/word-bundle";
import {WordBundleDao} from "../../dao/word-bundle/word-bundle.dao";
import {Word} from "../../domain/word";

@Injectable()
export class WordBundleService {

  private wordBundlesVault = new Map<number, BehaviorSubject<WordBundle>>();
  private wordBundleIds: number[];
  private wordBundleIdsSubj: BehaviorSubject<number[]>;

  constructor(private wordBundleDao: WordBundleDao) {
  }

  getWordBundleIds(): Observable<number[]> {
    return this.wordBundleDao.loadFullWordBundleList()
      .flatMap((wordBundles: WordBundle[]) => {
        this.wordBundleIds = [];
        wordBundles.forEach((wordBundle: WordBundle) => {
          this.wordBundlesVault.set(wordBundle.id, new BehaviorSubject(wordBundle));
          this.wordBundleIds.push(wordBundle.id);
        });

        if (this.wordBundleIdsSubj) {
          this.wordBundleIdsSubj.next(this.wordBundleIds);
        } else {
          this.wordBundleIdsSubj = new BehaviorSubject(this.wordBundleIds);
        }

        return this.wordBundleIdsSubj;
      });
  }

  getWordBundle(wordBundleId: number): Observable<WordBundle> {
    return this.wordBundlesVault.get(wordBundleId);
  }

  addWordBundle(wordBundle: WordBundle): void {
    this.wordBundleDao.addWordBundle(wordBundle)
      .subscribe(wordBundle => {
        this.wordBundlesVault.set(wordBundle.id, new BehaviorSubject(wordBundle));
        this.wordBundleIds.push(wordBundle.id);
        this.wordBundleIdsSubj.next(this.wordBundleIds);
      });
  }

  updateWordBundle(wordBundle: WordBundle): void {
    this.wordBundleDao.updateWordBundle(wordBundle)
      .subscribe(updatedWordBundle => {
        this.wordBundlesVault.get(updatedWordBundle.id)
          .next(updatedWordBundle);
      });
  }

  addWordToBundle(wordBundle: WordBundle, word: Word) {
    this.wordBundleDao.addWordToBundle(wordBundle.id, word.id)
      .subscribe(() => {
        this.reloadWordBundle(wordBundle.id);
      });
  }

  private reloadWordBundle(wordBundleId: number) {
    this.wordBundleDao.loadWordBundle(wordBundleId)
      .subscribe(wordBundle => {
        this.wordBundlesVault.get(wordBundle.id).next(wordBundle)
      });
  }
}
