import {Component, OnInit, Input} from "@angular/core";
import {WordBundle} from "../../../../domain/word-bundle";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {WordBundleService} from "../../../../services/word-bundle/word-bundle.service";
import {EntityUtils} from "../../../../utils/entity-utils";
import set = Reflect.set;

@Component({
  selector: 'word-bundle-picker',
  templateUrl: './word-bundle-picker.component.html',
  styleUrls: ['./word-bundle-picker.component.less']
})
export class WordBundlePickerComponent implements OnInit {

  @Input() activeWordBundleSubj: BehaviorSubject<WordBundle>;
  @Input() editWordBundleSubj: Subject<WordBundle>;

  private wordBundles: WordBundle[] = [];
  private activeWordBundle: WordBundle;

  constructor(private wordBundleService: WordBundleService) {
  }

  ngOnInit() {
    this.wordBundleService.getWordBundleIds().subscribe(wordBundleIds => {
      let wordBundles = wordBundleIds.map(wordBundleIds => this.wordBundleService.getWordBundle(wordBundleIds));
      let wordBundlesObs: Observable<WordBundle[]> = EntityUtils.mergeObservables(wordBundles);

      wordBundlesObs.subscribe(wordBundles => {
        this.wordBundles = wordBundles.sort(WordBundle.wordBundleAscNameComparator);
        if (this.activeWordBundle) {
          this.pickWordBundle(wordBundles.filter(wordBundle => wordBundle.id == this.activeWordBundle.id)[0]);
        }
        if (!this.activeWordBundle && wordBundles[0]) {
          this.pickWordBundle(wordBundles[0]);
        }
        if (wordBundles.length === 0) {
          this.activeWordBundleSubj.next(undefined);
        }
      });
    });

    this.activeWordBundleSubj.subscribe(activeWordBundle => {
      this.activeWordBundle = activeWordBundle;
    });
  }

  addWordBundle() {
    this.editWordBundleSubj.next({
      name: '',
      importance: 5,
      wordIds: []
    });
  }

  pickWordBundle(wordBundle: WordBundle) {
    this.activeWordBundleSubj.next(wordBundle);
  }

  editWordBundle() {
    this.editWordBundleSubj.next(this.activeWordBundle);
  }
}
