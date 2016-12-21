import {Injectable} from "@angular/core";
import {Observable, BehaviorSubject} from "rxjs";
import {WordBundle} from "../../domain/word-bundle";
import {WordBundleDao} from "../../dao/word-bundle/word-bundle.dao";

@Injectable()
export class WordBundleService {

  private wordBundlesObs: Observable<WordBundle[]>;
  private wordBundlesChangeObs = new BehaviorSubject<boolean>(true);

  constructor(private wordBundleDao: WordBundleDao) {
    this.wordBundlesObs = Observable.create(observer => {
      this.wordBundlesChangeObs.subscribe(() =>
        wordBundleDao.loadWordBundles()
          .then(wordBundles => observer.next(wordBundles))
      );
    });
  }

  getWordBundles(): Observable<WordBundle[]> {
    return this.wordBundlesObs;
  }

  addWordBundle(wordBundle: WordBundle): Promise<Observable<WordBundle>> {
    return this.wordBundleDao.addWordBundle(wordBundle)
      .then(wordBundle => {
        this.wordBundlesChangeObs.next(true);
        return this.wordBundlesObs
          .map(wordBundles =>
            wordBundles
              .filter(wordBundleInList => wordBundleInList.id === wordBundle.id)
              .pop()
          )
      });
  }

}
