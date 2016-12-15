import {Component, OnInit} from "@angular/core";
import {Word} from "../../domain/word";
import {WordService} from "../../services/word/word.service";
import {UserService} from "../../services/user/user.service";

@Component({
  selector: 'app-words',
  templateUrl: './words.component.html',
  styleUrls: ['./words.component.less']
})
export class WordsComponent implements OnInit {

  title = 'Add new word';

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
