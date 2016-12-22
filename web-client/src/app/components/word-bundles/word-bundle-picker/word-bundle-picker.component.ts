import {Component, OnInit, Input} from "@angular/core";
import {WordBundle} from "../../../domain/word-bundle";
import {BehaviorSubject, Observable} from "rxjs";

@Component({
  selector: 'word-bundle-picker',
  templateUrl: './word-bundle-picker.component.html',
  styleUrls: ['./word-bundle-picker.component.less']
})
export class WordBundlePickerComponent implements OnInit {

  @Input() wordBundlesObs: Observable<WordBundle[]>;
  @Input() activeWordBundleSubj: BehaviorSubject<WordBundle>;
  private wordBundles: WordBundle[] = [];
  private activeWordBundle: WordBundle;

  constructor() {
  }

  private wordBundleAscNameComporator(wordBundle1: WordBundle, wordBundle2: WordBundle): number {
    if (wordBundle1.name > wordBundle2.name) return 1;
    if (wordBundle1.name < wordBundle2.name) return -1;
    if (wordBundle1.name == wordBundle2.name) return wordBundle1.id - wordBundle2.id;
  }

  ngOnInit() {
    var isPageLoad = true;
    this.wordBundlesObs.subscribe(wordBundles => {
      this.wordBundles = wordBundles.sort(this.wordBundleAscNameComporator);
      if (isPageLoad) {
        this.activeWordBundleSubj.next(this.wordBundles[0]);
        isPageLoad = false;
      }
    });
    this.activeWordBundleSubj.subscribe(activeWordBundle => {
      this.activeWordBundle = activeWordBundle;
    });
  }

  addWordBundle() {
    this.activeWordBundleSubj.next({
      name: '',
      importance: 5,
      words: []
    });
  }

  pickWordBundle(wordBundle: WordBundle) {
    this.activeWordBundleSubj.next(wordBundle);
  }
}
