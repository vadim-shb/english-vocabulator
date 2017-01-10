import {Component, OnInit} from "@angular/core";
import {WordBundle} from "../../../../domain/word-bundle";
import {WordAndBundleEditorService} from "../../../component-services/word-and-bundle-editor/word-and-bundle-editor.service";
import {WordBundlePickerService} from "../../../component-services/word-and-bundle-editor/word-bundle-picker/word-bundle-picker.service";
import set = Reflect.set;

@Component({
  selector: 'word-bundle-picker',
  templateUrl: './word-bundle-picker.component.html',
  styleUrls: ['./word-bundle-picker.component.less']
})
export class WordBundlePickerComponent implements OnInit {


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
}
