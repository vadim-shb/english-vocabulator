import {Component, OnInit, Input} from "@angular/core";
import {WordBundle} from "../../../domain/word-bundle";
import {BehaviorSubject, Observable} from "rxjs";
import {WordBundleService} from "../../../services/word-bundle/word-bundle.service";
import {EntityUtils} from "../../../utils/entity-utils";

@Component({
  selector: 'word-bundle-picker',
  templateUrl: './word-bundle-picker.component.html',
  styleUrls: ['./word-bundle-picker.component.less']
})
export class WordBundlePickerComponent implements OnInit {

  @Input() activeWordBundleSubj: BehaviorSubject<WordBundle>;

  private wordBundles: WordBundle[] = [];
  private activeWordBundle: WordBundle;

  constructor(private wordBundleService: WordBundleService) {
  }

  private wordBundleAscNameComparator(wordBundle1: WordBundle, wordBundle2: WordBundle): number {
    if (wordBundle1.name > wordBundle2.name) return 1;
    if (wordBundle1.name < wordBundle2.name) return -1;
    if (wordBundle1.name == wordBundle2.name) return wordBundle1.id - wordBundle2.id;
  }

  ngOnInit() {
    this.wordBundleService.getWordBundleIds().subscribe(wordBundleIds => {
      let wordBundles = wordBundleIds.map(wordBundleIds => this.wordBundleService.getWordBundle(wordBundleIds));
      let wordBundlesObs: Observable<WordBundle[]> = EntityUtils.mergeObservables(wordBundles);

      wordBundlesObs.subscribe(wordBundles => {
        this.wordBundles = wordBundles.sort(this.wordBundleAscNameComparator);
      });
      wordBundlesObs.first().subscribe(wordBundles => {
        if (wordBundles[0]) {
          this.pickWordBundle(wordBundles[0]);
        }
      });
    });

    this.activeWordBundleSubj.subscribe(activeWordBundle => {
      this.activeWordBundle = activeWordBundle;
    });
  }

  addWordBundle() {
    this.activeWordBundleSubj.next({
      name: '',
      importance: 5,
      wordIds: []
    });
  }

  pickWordBundle(wordBundle: WordBundle) {
    this.activeWordBundleSubj.next(wordBundle);
  }
}
