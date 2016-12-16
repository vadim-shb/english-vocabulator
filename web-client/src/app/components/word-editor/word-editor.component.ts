import {Component, OnInit} from "@angular/core";
import {UserService} from "../../services/user/user.service";
import {Word} from "../../domain/word";
import {WordService} from "../../services/word/word.service";

@Component({
  selector: 'word-editor',
  templateUrl: './word-editor.component.html',
  styleUrls: ['./word-editor.component.less']
})
export class WordEditorComponent implements OnInit {

  title: string;

  word: Word = {
    id: null,
    word: '',
    meanings: [{
      id: null,
      positionInOrder: 1,
      meaning: ''
    }],
    importance: 5
  };

  constructor(private userService: UserService,
              private wordService: WordService) {
  }

  ngOnInit() {
    this.title = 'Add new word';
    this.userService.logInIfNot();
  }

  addMeaning() {
    this.word.meanings.push({
      id: null,
      positionInOrder: this.word.meanings.length,
      meaning: ''
    });
  }

  saveWord() {
    this.wordService.addWord(this.word)
      .then(word => this.word = word);
  }

}
