import {Component, OnInit, Input} from "@angular/core";
import {Observable, Subject, Subscription} from "rxjs";
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
  private wordsInBundleObs: Observable<Word[]>;
  private allWordsObs: Observable<Word[]> = this.wordService.getAllWords();

  private mode;
  private words: Word[];
  private activeWord: Word;
  private activeWordBundle: WordBundle;
  private currentWordsSubscription: Subscription;

  constructor(private wordService: WordService,
              private wordBundleService: WordBundleService) {
  }

  setMode(mode: WordsListMode) {
    if (this.mode === mode) return;
    this.mode = mode;

    if (this.currentWordsSubscription) {
      this.currentWordsSubscription.unsubscribe();
    }

    let wordsObservable;
    if (mode === WordsListMode.WORDS_IN_BUNDLE) wordsObservable = this.wordsInBundleObs;
    if (mode === WordsListMode.ALL_WORDS) wordsObservable = this.allWordsObs;

    this.currentWordsSubscription = wordsObservable.subscribe(words => {
      this.words = words.sort(Word.wordAscAlphabeticalComparator);
      if ((!this.activeWord || !~this.words.indexOf(this.activeWord)) && this.words[0]) {
        this.activeWordSubj.next(this.words[0])
      }
    });
  }

  ngOnInit() {
    this.activeWordBundleObs.subscribe(wordBundle => {
      if (wordBundle) {
        this.wordsInBundleObs = this.wordService.getWordsByIds(wordBundle.wordIds);
        this.setMode(WordsListMode.WORDS_IN_BUNDLE);
      }
    });
    this.activeWordSubj.subscribe(word => this.activeWord = word);
    this.activeWordBundleObs.subscribe(wordBundle => this.activeWordBundle = wordBundle);
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

}
