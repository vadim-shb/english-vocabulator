import {Injectable} from "@angular/core";
import {WordAndBundleEditorService} from "../word-and-bundle-editor.service";
import {WordBundleService} from "../../../../services/word-bundle/word-bundle.service";
import {WordService} from "../../../../services/word/word.service";
import {Word} from "../../../../domain/word";
import {ReplaySubject, Observable, Subscription} from "rxjs";

export enum WordsListMode {
  WORDS_IN_BUNDLE, ALL_WORDS
}

@Injectable()
export class WordsInBundleService {

  wordsObs: Observable<Word[]>;
  mode: WordsListMode;

  private wordsInBundleSubj = new ReplaySubject<Word[]>(1);
  private allWordsObs: Observable<Word[]> = this.wordService.getAllWords().map(words => words.sort(Word.wordAscAlphabeticalComparator));

  private firstWordActivatorSubscription: Subscription;
  private emptyWordsDeactivatorSubscription: Subscription;

  constructor(private wordService: WordService,
              private wordBundleService: WordBundleService,
              private wordAndBundleEditorService: WordAndBundleEditorService) {

    let wordsOfBundleSubscription: Subscription;
    this.wordAndBundleEditorService.activeWordBundleSubj.subscribe(wordBundle => {
      if (wordsOfBundleSubscription) wordsOfBundleSubscription.unsubscribe();
      if (wordBundle) {
        wordsOfBundleSubscription = this.wordBundleService.getWordsOfWordBundle(wordBundle)
          .map(words => words.sort(Word.wordAscAlphabeticalComparator))
          .subscribe(words => {
            this.wordsInBundleSubj.next(words);
          });
      }
    });

    this.setInitialMode();
  }

  private setInitialMode() {
    /**
     * fixme: some angular trouble. Remove setTimeout if angular will not throw an error in devMode.
     * See:
     * https://github.com/angular/angular/issues/6005
     * https://github.com/angular/angular/issues/10131
     * https://github.com/angular/angular/issues/10762
     **/
    setTimeout(() => this.setMode(WordsListMode.WORDS_IN_BUNDLE));
  }

  setMode(mode: WordsListMode) {
    if (this.mode === mode) return;
    this.mode = mode;

    if (mode === WordsListMode.WORDS_IN_BUNDLE) this.wordsObs = this.wordsInBundleSubj;
    if (mode === WordsListMode.ALL_WORDS) this.wordsObs = this.allWordsObs;

    this.activateFirstWordIfNoActiveWordInList();
    this.deactivateWordIfEmptyList();
  }

  private activateFirstWordIfNoActiveWordInList() {
    if (this.firstWordActivatorSubscription) {
      this.firstWordActivatorSubscription.unsubscribe();
    }

    this.firstWordActivatorSubscription = this.wordsObs.subscribe(words => {
      if (words.length === 0) {
        this.wordAndBundleEditorService.activeWordSubj.next(undefined);
      }

      Observable.of(0)
        .takeUntil(this.wordAndBundleEditorService.activeWordSubj)
        .subscribe(() => {
          if (words[0]) {
            this.wordAndBundleEditorService.activeWordSubj.next(words[0]);
          }
        });

      this.wordAndBundleEditorService.activeWordSubj.first().subscribe(activeWord => {
        if (words[0]) {
          if (activeWord) {
            if (words.filter(word => word.id == activeWord.id).length === 0) {
              this.wordAndBundleEditorService.activeWordSubj.next(words[0]);
            }
          } else {
            this.wordAndBundleEditorService.activeWordSubj.next(words[0]);
          }
        }
      });
    });
  }

  private deactivateWordIfEmptyList() {
    if (this.emptyWordsDeactivatorSubscription) {
      this.emptyWordsDeactivatorSubscription.unsubscribe();
    }

    this.emptyWordsDeactivatorSubscription = this.wordsObs.subscribe(words => {
      if (words.length === 0) {
        this.wordAndBundleEditorService.activeWordSubj.next(undefined);
      }
    });
  }

  addWord() {
    this.wordAndBundleEditorService.editWordSubj.next({
      word: '',
      meaning: '',
      usageExamples: '',
      importance: 5
    });
  }

  activateWord(word: Word) {
    this.wordAndBundleEditorService.activeWordSubj.next(word);
  }

  unbindWordFromBundle() {
    this.wordAndBundleEditorService.activeWordSubj.first().subscribe(activeWord => {
      this.wordAndBundleEditorService.activeWordBundleSubj.first().subscribe(activeWordBundle => {
        this.wordBundleService.unbindWordFromBundle(activeWordBundle, activeWord);
      });
    });
  }

  bindWordToBundle() {
    this.wordAndBundleEditorService.activeWordSubj.first().subscribe(activeWord => {
      this.wordAndBundleEditorService.activeWordBundleSubj.first().subscribe(activeWordBundle => {
        this.wordBundleService.bindWordToBundle(activeWordBundle, activeWord);
      });
    });
  }
}
