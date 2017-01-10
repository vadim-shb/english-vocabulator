import {Component, OnInit, Input} from "@angular/core";
import {WordBundle} from "../../../../domain/word-bundle";
import {Subject} from "rxjs";
import {WordBundleScreen} from "../word-and-bundle-editor.component";
import {WordAndBundleEditorService} from "../../../component-services/word-and-bundle-editor/word-and-bundle-editor.service";
import {WordBundlePickerService} from "../../../component-services/word-and-bundle-editor/word-bundle-picker/word-bundle-picker.service";

@Component({
  selector: 'word-bundle-picker',
  templateUrl: './word-bundle-picker.component.html',
  styleUrls: ['./word-bundle-picker.component.less']
})
export class WordBundlePickerComponent implements OnInit {

  @Input() currentScreenSubj: Subject<WordBundleScreen>;

  constructor(private wordAndBundleEditorService: WordAndBundleEditorService,
              private wordBundlePickerService: WordBundlePickerService) {
  }

  ngOnInit() {
  }

  addWordBundle() {
    this.wordBundlePickerService.addWordBundle();
  }

  pickWordBundle(wordBundle: WordBundle) {
    this.wordBundlePickerService.pickWordBundle(wordBundle);
  }

  editWordBundle() {
    this.wordBundlePickerService.editWordBundle();
  }

  editWordsInBundle() {
    this.currentScreenSubj.next(WordBundleScreen.PICK_WORD);
  }
}
