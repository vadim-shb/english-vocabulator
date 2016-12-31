import {Component, OnInit, Input} from "@angular/core";
import {Subject} from "rxjs";
import {WordBundle} from "../../../../domain/word-bundle";
import {WordBundleService} from "../../../../services/word-bundle/word-bundle.service";

@Component({
  selector: 'word-bundle-editor',
  templateUrl: './word-bundle-editor.component.html',
  styleUrls: ['./word-bundle-editor.component.less']
})
export class WordBundleEditorComponent implements OnInit {

  @Input() editWordBundleSubj: Subject<WordBundle>;
  private wordBundle: WordBundle;
  private importanceValues = [];
  private title: string;
  private removeDialogShowSwitcher = false;

  constructor(private wordBundleService: WordBundleService) {
  }

  ngOnInit() {
    for (let i = 0; i <= 10; i++) {
      this.importanceValues.push({value: i, view: i})
    }

    this.editWordBundleSubj.subscribe(wordBundle => {
      this.wordBundle = Object.assign({}, wordBundle);
      if (this.wordBundle.id) {
        this.title = 'Edit word bundle';
      } else {
        this.title = 'New word bundle';
      }
    });
  }

  importanceChanged(newImportance: string) {
    this.wordBundle.importance = parseInt(newImportance);
  }

  saveWordBundle() {
    if (this.wordBundle.id) {
      this.wordBundleService.updateWordBundle(this.wordBundle);
    } else {
      this.wordBundleService.addWordBundle(this.wordBundle);
    }
    this.cancelEditing();
  }

  cancelEditing() {
    this.editWordBundleSubj.next(undefined);
  }

  showRemoveDialog() {
    this.removeDialogShowSwitcher = true;
  }

  hideRemoveDialog() {
    this.removeDialogShowSwitcher = false;
  }

  removeBundleKeepWords() {
    this.wordBundleService.removeWordBundle(this.wordBundle.id)
      .subscribe(() => {
        this.cancelEditing();
      });
  }

  removeBundleWithWords() {

    // this.cancelEditing();
  }

}
