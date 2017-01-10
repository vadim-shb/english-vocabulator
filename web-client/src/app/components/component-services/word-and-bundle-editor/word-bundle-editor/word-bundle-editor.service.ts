import {Injectable} from "@angular/core";
import {WordAndBundleEditorService} from "../word-and-bundle-editor.service";
import {WordBundleService} from "../../../../services/word-bundle/word-bundle.service";
import {WordService} from "../../../../services/word/word.service";
import {WordBundle} from "../../../../domain/word-bundle";

@Injectable()
export class WordBundleEditorService {

  wordBundle: WordBundle;
  importanceValues = [];
  title: string;

  constructor(private wordService: WordService,
              private wordBundleService: WordBundleService,
              private wordAndBundleEditorService: WordAndBundleEditorService) {
    this.prepareImportanceValues();
    this.setTitle();
    this.setWordBundleToEdit();
  }

  private setWordBundleToEdit() {
    this.wordAndBundleEditorService.editWordBundleSubj.subscribe(wordBundle => {
      this.wordBundle = Object.assign({}, wordBundle);
    });
  }

  private setTitle() {
    this.wordAndBundleEditorService.editWordBundleSubj.subscribe(wordBundle => {
      if (wordBundle && wordBundle.id) {
        this.title = 'Edit word bundle';
      } else {
        this.title = 'New word bundle';
      }
    });
  }

  private prepareImportanceValues() {
    for (let i = 0; i <= 10; i++) {
      this.importanceValues.push({value: i, view: i})
    }
  }

  cancelEditing() {
    this.wordAndBundleEditorService.editWordBundleSubj.next(undefined);
  }

  removeWordBundle() {
    this.wordAndBundleEditorService.editWordBundleSubj.first().subscribe(wordBundle => {
      this.wordBundleService.removeWordBundle(wordBundle.id)
        .subscribe(() => {
          this.cancelEditing();
        });
    });
  }

  removeBundleWithWords() {
    this.wordAndBundleEditorService.editWordBundleSubj.first().subscribe(wordBundle => {
      wordBundle.wordIds.forEach(wordId => {
        this.wordService.removeWord(wordId);
      });
      this.removeWordBundle();
    });
  }

  saveWordBundle() {
    if (this.wordBundle.id) {
      this.wordBundleService.updateWordBundle(this.wordBundle);
    } else {
      this.wordBundleService.addWordBundle(this.wordBundle);
    }
    this.cancelEditing();
  }

  wordBundleImportanceChanged(newImportance: string) {
    this.wordBundle.importance = parseInt(newImportance);
  }
}
