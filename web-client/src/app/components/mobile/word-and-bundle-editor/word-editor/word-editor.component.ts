import {Component, OnInit} from "@angular/core";
import {WordAndBundleEditorService} from "../../../component-services/word-and-bundle-editor/word-and-bundle-editor.service";
import {WordEditorService} from "../../../component-services/word-and-bundle-editor/word-editor/word-editor.service";

@Component({
  selector: 'word-editor',
  templateUrl: './word-editor.component.html',
  styleUrls: ['./word-editor.component.less']
})
export class WordEditorComponent implements OnInit {

  constructor(private wordAndBundleEditorService: WordAndBundleEditorService,
              private wordEditorService: WordEditorService) {
  }

  ngOnInit() {
  }

  importanceChanged(newImportance: string) {
    this.wordEditorService.wordImportanceChanged(newImportance);
  }

  saveWord() {
    this.wordEditorService.saveWord();
    this.wordAndBundleEditorService.editWordSubj.next(undefined);
  }

  removeWord() {
    this.wordEditorService.removeWord();
    this.wordAndBundleEditorService.editWordSubj.next(undefined);
  }

  cancel() {
    this.wordAndBundleEditorService.editWordSubj.next(undefined);
  }
}
