import {Component, OnInit} from "@angular/core";
import {UserService} from "../../services/user/user.service";
import {Word} from "../../domain/word";
import {WordService} from "../../services/word/word.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import "rxjs/add/operator/switchMap";

@Component({
  selector: 'word-editor',
  templateUrl: './word-editor.component.html',
  styleUrls: ['./word-editor.component.less']
})
export class WordEditorComponent implements OnInit {

  title: string;
  word: Word;
  wordEditorDisabled: boolean = false;
  importanceValues = [];
  constructor(private userService: UserService,
              private wordService: WordService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.title = 'Add new word';
    for (var i = 0; i <=10; i++) {this.importanceValues.push({value: i, view: i})}
    this.userService.signInIfNot();
    this.newWord();
    this.route.params
      .subscribe((params: Params) => {
        let wordId = params['wordId'];
        if (typeof wordId === 'undefined') {
          this.newWord();
          this.deactivateWordEditor();
          return;
        }
        if (wordId == 'new') {
          this.newWord();
          return;
        }
        this.loadWord(wordId);
      });
  }

  importanceChanged(newImportance: string) {
    this.word.importance = parseInt(newImportance);
  }

  newWord() {
    this.word = {
      word: '',
      meaning: '',
      usageExamples: '',
      importance: 5
    };
    this.activateWordEditor();
  }

  loadWord(wordId: number) {
    this.wordService.getWord(wordId)
      .then((word: Word) => {
        this.word = word;
        this.activateWordEditor();
      });
  }

  saveWord() {
    this.wordService.saveWord(this.word)
      .then(word => this.router.navigate(['word', word.id]));
  }

  private activateWordEditor() {
    this.wordEditorDisabled = false;
  }

  private deactivateWordEditor() {
    this.wordEditorDisabled = true;
  }
}
