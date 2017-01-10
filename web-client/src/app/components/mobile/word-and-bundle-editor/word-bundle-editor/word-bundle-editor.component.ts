import {Component, OnInit} from "@angular/core";
import {WordBundleEditorService} from "../../../component-services/word-and-bundle-editor/word-bundle-editor/word-bundle-editor.service";

@Component({
  selector: 'word-bundle-editor',
  templateUrl: './word-bundle-editor.component.html',
  styleUrls: ['./word-bundle-editor.component.less']
})
export class WordBundleEditorComponent implements OnInit {

  private removeDialogShowSwitcher = false;

  constructor(private wordBundleEditorService: WordBundleEditorService) {
  }

  ngOnInit() {
  }

  importanceChanged(newImportance: string) {
    this.wordBundleEditorService.wordBundleImportanceChanged(newImportance);
  }

  saveWordBundle() {
    this.wordBundleEditorService.saveWordBundle();
  }

  cancelEditing() {
    this.wordBundleEditorService.cancelEditing();
  }

  showRemoveDialog() {
    this.removeDialogShowSwitcher = true;
  }

  hideRemoveDialog() {
    this.removeDialogShowSwitcher = false;
  }

  removeBundle() {
    this.wordBundleEditorService.removeWordBundle();
  }

  removeBundleWithWords() {
    this.wordBundleEditorService.removeBundleWithWords();
  }

}
