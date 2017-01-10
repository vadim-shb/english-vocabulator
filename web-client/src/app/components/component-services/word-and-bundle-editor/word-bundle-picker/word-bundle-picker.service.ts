import {Injectable} from "@angular/core";
import {WordAndBundleEditorService} from "../word-and-bundle-editor.service";
import {WordBundle} from "../../../../domain/word-bundle";

@Injectable()
export class WordBundlePickerService {

  constructor(private wordAndBundleEditorService: WordAndBundleEditorService) {
  }

  addWordBundle() {
    this.wordAndBundleEditorService.editWordBundleSubj.next({
      name: '',
      importance: 5,
      wordIds: []
    });
  }

  pickWordBundle(wordBundle: WordBundle) {
    this.wordAndBundleEditorService.activateWordBundle(wordBundle);
  }

  editWordBundle() {
    this.wordAndBundleEditorService.activeWordBundleSubj.first().subscribe(activeWordBundle => {
      this.wordAndBundleEditorService.editWordBundleSubj.next(activeWordBundle);
    });
  }
}
