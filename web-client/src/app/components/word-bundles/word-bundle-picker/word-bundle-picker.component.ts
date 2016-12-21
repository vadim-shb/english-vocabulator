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
  private wordBundles : WordBundle[] = [];
  private activeWordBundle : WordBundle;

  constructor() {
  }

  ngOnInit() {
    this.wordBundlesObs.subscribe(wordBundles => {
      this.wordBundles = wordBundles;
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
