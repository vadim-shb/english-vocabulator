import {Component, OnInit, Input} from "@angular/core";
import {Observable, Subject, Subscription, ReplaySubject} from "rxjs";
import {WordBundle} from "../../../../domain/word-bundle";
import {Word} from "../../../../domain/word";
import {WordService} from "../../../../services/word/word.service";
import {WordBundleService} from "../../../../services/word-bundle/word-bundle.service";

enum WordsListMode {
  WORDS_IN_BUNDLE, ALL_WORDS
}

@Component({
  selector: 'words-in-bundle',
  templateUrl: './words-in-bundle.component.html',
  styleUrls: ['./words-in-bundle.component.less']
})
export class WordsInBundleComponent implements OnInit {
  private wordsListMode = WordsListMode;

  @Input() activeWordBundleObs: Observable<WordBundle>;
  @Input() activeWordSubj: Subject<Word>;
  private wordsInBundleSubj = new ReplaySubject<Word[]>(1);
  private allWordsObs: Observable<Word[]> = this.wordService.getAllWords();

  private mode;
  private words: Word[];
  private activeWord: Word;
  private activeWordBundle: WordBundle;
  private currentWordsSubscription: Subscription;

  constructor(private wordService: WordService,
              private wordBundleService: WordBundleService) {
  }

  ngOnInit() {
    let wordsOfBundleSubscription: Subscription;
    this.activeWordBundleObs.subscribe(wordBundle => {
      if (wordsOfBundleSubscription) wordsOfBundleSubscription.unsubscribe();
      wordsOfBundleSubscription = this.wordBundleService.getWordsOfWordBundle(wordBundle)
        .subscribe(words => {
          this.wordsInBundleSubj.next(words);
        });
    });

    this.activeWordSubj.subscribe(word => this.activeWord = word);
    this.activeWordBundleObs.subscribe(wordBundle => this.activeWordBundle = wordBundle);
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

    if (this.currentWordsSubscription) {
      this.currentWordsSubscription.unsubscribe();
    }

    let wordsObservable;
    if (mode === WordsListMode.WORDS_IN_BUNDLE) wordsObservable = this.wordsInBundleSubj;
    if (mode === WordsListMode.ALL_WORDS) wordsObservable = this.allWordsObs;

    this.currentWordsSubscription = wordsObservable.subscribe(words => {
      this.words = words.sort(Word.wordAscAlphabeticalComparator);
      if ((!this.activeWord || !~this.words.indexOf(this.activeWord)) && this.words[0]) {
        this.activeWordSubj.next(this.words[0])
      }
    });
  }

  addWord() {
    this.activeWordSubj.next({
      word: '',
      meaning: '',
      usageExamples: '',
      importance: 5
    });
  }

  pickWord(word: Word) {
    this.activeWordSubj.next(word);
  }

  unbindWordFromBundle() {
    this.wordBundleService.unbindWordFromBundle(this.activeWordBundle, this.activeWord);
  }

  bindWordToBundle() {
    this.wordBundleService.bindWordToBundle(this.activeWordBundle, this.activeWord);
  }

}
