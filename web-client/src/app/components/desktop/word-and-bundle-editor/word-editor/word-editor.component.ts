import {Component, OnInit} from "@angular/core";
import {WordEditorService} from "../../../component-services/word-and-bundle-editor/word-editor/word-editor.service";

@Component({
  selector: 'word-editor',
  templateUrl: './word-editor.component.html',
  styleUrls: ['./word-editor.component.less']
})
export class WordEditorComponent implements OnInit {

  constructor(private wordEditorService: WordEditorService) {
  }

  ngOnInit() {
  }

  importanceChanged(newImportance: string) {
    this.wordEditorService.wordImportanceChanged(newImportance);
  }

  saveWord() {
    this.wordEditorService.saveWord();
  }

  removeWord() {
    this.wordEditorService.removeWord();
  }
}
