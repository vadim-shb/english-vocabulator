import {Injectable} from "@angular/core";
import {Subscription, ReplaySubject, Observable} from "rxjs";
import {Word} from "../../../domain/word";
import {WordBundle} from "../../../domain/word-bundle";
import {WordService} from "../../../services/word/word.service";
import {WordBundleService} from "../../../services/word-bundle/word-bundle.service";

@Injectable()
export class WordAndBundleEditorService {

  editWordBundleSubj = new ReplaySubject<WordBundle>(1);
  editWordSubj = new ReplaySubject<Word>(1);
  activeWordBundleSubj = new ReplaySubject<WordBundle>(1);
  activeWordSubj = new ReplaySubject<Word>(1);
  allWordBundlesObs: Observable<WordBundle[]>;

  private activeWordCurrentSubscription: Subscription;

  constructor(private wordService: WordService,
              private wordBundleService: WordBundleService) {

    this.allWordBundlesObs = this.wordBundleService.getAllWordBundles()
      .map(wordBundles => {
        return wordBundles.sort(WordBundle.wordBundleAscNameComparator);
      });

    this.dropActiveWordBundleIfAllBundlesRemoved();
    this.activateFirstWordBundleIfNoActiveBundle();
    this.dropActiveWordIfItWasDeleted();
  }

  private dropActiveWordBundleIfAllBundlesRemoved() {
    this.allWordBundlesObs.subscribe(wordBundles => {
      if (wordBundles.length === 0) {
        this.activeWordBundleSubj.next(undefined);
      }
    });
  }

  private activateFirstWordBundleIfNoActiveBundle() {
    this.allWordBundlesObs.subscribe(wordBundles => {
      Observable.of(0)
        .takeUntil(this.activeWordBundleSubj)
        .subscribe(() => {
          if (wordBundles[0]) {
            this.activateWordBundle(wordBundles[0]);
          }
        });

      this.activeWordBundleSubj.first().subscribe(activeWordBundle => {
        if (!activeWordBundle && wordBundles[0]) {
          this.activateWordBundle(wordBundles[0]);
        }
      });
    });
  }

  private dropActiveWordIfItWasDeleted() {
    this.activeWordSubj.subscribe(word => {
      if (word && word.id) {
        this.activeWordCurrentSubscription = this.wordService.getWord(word.id).subscribe(
          () => {
          },
          () => {
          },
          () => {
            this.activeWordSubj.next(undefined);
            this.activeWordCurrentSubscription.unsubscribe();
          })
      }
    });
  }


  private activeWordBundleSubscription: Subscription;
  activateWordBundle(wordBundle: WordBundle) {
    if (this.activeWordBundleSubscription) {
      this.activeWordBundleSubscription.unsubscribe();
    }
    this.activeWordBundleSubscription = this.wordBundleService.getWordBundle(wordBundle.id).subscribe(wordBundle => {
      this.activeWordBundleSubj.next(wordBundle);
    });
  }
}
