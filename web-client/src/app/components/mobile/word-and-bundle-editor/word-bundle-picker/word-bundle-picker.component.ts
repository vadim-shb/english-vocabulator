import {Component, OnInit, Input} from "@angular/core";
import {WordBundle} from "../../../../domain/word-bundle";
import {Observable, Subject, Subscription} from "rxjs";
import {WordBundleService} from "../../../../services/word-bundle/word-bundle.service";
import {EntityUtils} from "../../../../utils/entity-utils";
import set = Reflect.set;
import {WordBundleScreen} from "../word-and-bundle-editor.component";

@Component({
  selector: 'word-bundle-picker',
  templateUrl: './word-bundle-picker.component.html',
  styleUrls: ['./word-bundle-picker.component.less']
})
export class WordBundlePickerComponent implements OnInit {

  @Input() activeWordBundleSubj: Subject<WordBundle>;
  @Input() editWordBundleSubj: Subject<WordBundle>;
  @Input() currentScreenSubj: Subject<WordBundleScreen>;

  private wordBundles: WordBundle[] = [];
  private activeWordBundle: WordBundle;
  private pickedWordBundleSubscription: Subscription;

  constructor(private wordBundleService: WordBundleService) {
  }

  ngOnInit() {
    this.wordBundleService.getWordBundleIds().subscribe(wordBundleIds => {
      let wordBundles = wordBundleIds.map(wordBundleIds => this.wordBundleService.getWordBundle(wordBundleIds));
      let wordBundlesObs: Observable<WordBundle[]> = EntityUtils.mergeObservables(wordBundles);

      wordBundlesObs.subscribe(wordBundles => {
        this.wordBundles = wordBundles.sort(WordBundle.wordBundleAscNameComparator);
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
    if (this.pickedWordBundleSubscription) {
      this.pickedWordBundleSubscription.unsubscribe();
    }
    this.pickedWordBundleSubscription = this.wordBundleService.getWordBundle(wordBundle.id).subscribe(wordBundle => {
      this.activeWordBundleSubj.next(wordBundle);
    });
  }

  editWordBundle() {
    this.editWordBundleSubj.next(this.activeWordBundle);
  }

  editWordsInBundle() {
    this.currentScreenSubj.next(WordBundleScreen.PICK_WORD);
  }
}
