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

  words: Word[];

  constructor(private userService: UserService,
              private wordService: WordService) {
  }

  ngOnInit() {
    this.userService.signInIfNot();
    this.wordService.getMyWords()
      .then(words => this.words = words);
  }

}
