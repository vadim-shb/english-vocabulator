import {Injectable} from "@angular/core";
import {WordAndBundleEditorService} from "../word-and-bundle-editor.service";
import {WordBundleService} from "../../../../services/word-bundle/word-bundle.service";
import {WordService} from "../../../../services/word/word.service";
import {Word} from "../../../../domain/word";

@Injectable()
export class WordEditorService {

  importanceValues = [];
  title: string;
  word: Word;

  constructor(private wordService: WordService,
              private wordBundleService: WordBundleService,
              private wordAndBundleEditorService: WordAndBundleEditorService) {
    this.prepareImportanceValues();
    this.setTitle();
    this.setWordToEdit();
  }

  private setWordToEdit() {
    this.wordAndBundleEditorService.editWordSubj.subscribe(word => {
      if (word) {
        this.word = Object.assign({}, word);
      }
    });
  }

  private setTitle() {
    this.wordAndBundleEditorService.editWordSubj.subscribe(word => {
      if (word) {
        if (word.id) {
          this.title = 'Edit word';
        } else {
          this.title = 'Add new word';
        }
      }
    });
  }

  private prepareImportanceValues() {
    for (let i = 0; i <= 10; i++) {
      this.importanceValues.push({value: i, view: i})
    }
  }

  wordImportanceChanged(newImportance: string) {
    this.word.importance = parseInt(newImportance);
  }

  removeWord() {
    this.wordService.removeWord(this.word.id);
  }

  saveWord() {
    if (this.word.id) {
      this.wordService.updateWord(this.word);
    } else {
      this.wordService.addWord(this.word) //todo: add word and connect it to the bundle in single request (when observables will be connected to server by websocket)
        .subscribe(word => {
          this.wordAndBundleEditorService.activeWordBundleSubj.first().subscribe(activeWordBundle => {
            this.wordBundleService.bindWordToBundle(activeWordBundle, word);

            let subscription = this.wordBundleService.getWordsOfWordBundle(activeWordBundle.id)
              .subscribe(words => {
                if (~words.indexOf(word)) {
                  this.wordAndBundleEditorService.activeWordSubj.next(word);
                  subscription.unsubscribe();
                }
              });
          });
        });
    }
  }
}
