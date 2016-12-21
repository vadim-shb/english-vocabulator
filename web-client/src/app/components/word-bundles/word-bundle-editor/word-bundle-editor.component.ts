import {Component, OnInit, Input} from "@angular/core";
import {Observable} from "rxjs";
import {WordBundle} from "../../../domain/word-bundle";
import {WordBundleService} from "../../../services/word-bundle/word-bundle.service";

@Component({
  selector: 'word-bundle-editor',
  templateUrl: './word-bundle-editor.component.html',
  styleUrls: ['./word-bundle-editor.component.less']
})
export class WordBundleEditorComponent implements OnInit {

  @Input() wordBundleObs: Observable<WordBundle>;
  private wordBundle: WordBundle;
  private importanceValues = [];

  constructor(private wordBundleService: WordBundleService) {
  }

  ngOnInit() {
    for (let i = 0; i <= 10; i++) { this.importanceValues.push({value: i, view: i}) }

    this.wordBundleObs.subscribe(wordBundle => {
      this.wordBundle = wordBundle;
    });
  }

  importanceChanged(newImportance: string) {
    this.wordBundle.importance = parseInt(newImportance);
  }

  saveWordBundle() {
    this.wordBundleService.addWordBundle(this.wordBundle);
  }

}
