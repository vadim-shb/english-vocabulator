import {Component, OnInit, Input} from "@angular/core";
import {Word} from "../../../../domain/word";
import {WordService} from "../../../../services/word/word.service";
import {Observable, Subject} from "rxjs";
import {WordBundle} from "../../../../domain/word-bundle";
import {WordBundleService} from "../../../../services/word-bundle/word-bundle.service";

@Component({
  selector: 'word-editor',
  templateUrl: './word-editor.component.html',
  styleUrls: ['./word-editor.component.less']
})
export class WordEditorComponent implements OnInit {

  @Input() editWordSubj: Subject<Word>;
  @Input() activeWordBundleObs: Observable<WordBundle>;

  private title: string;
  private word: Word;
  private activeWordBundle: WordBundle;
  private importanceValues = [];

  constructor(private wordService: WordService,
              private wordBundleService: WordBundleService) {
  }

  ngOnInit() {
    for (var i = 0; i <= 10; i++) {
      this.importanceValues.push({value: i, view: i})
    }

    this.activeWordBundleObs.subscribe(wordBundle => this.activeWordBundle = wordBundle);

    this.editWordSubj.subscribe(word => {
      this.word = Object.assign({}, word);
      if (word.id) {
        this.title = 'Edit word';
      } else {
        this.title = 'Add new word';
      }
    });
  }

  importanceChanged(newImportance: string) {
    this.word.importance = parseInt(newImportance);
  }

  saveWord() {
    if (this.word.id) {
      this.wordService.updateWord(this.word);
    } else {
      this.wordService.addWord(this.word) //todo: add word and connect it to the bundle in single request (when observables will be connected to server by websocket)
        .subscribe(word => {
          this.wordBundleService.addWordToBundle(this.activeWordBundle, word);
          this.editWordSubj.next(word)
        });
    }
  }
}
