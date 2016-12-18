import {Component, OnInit} from "@angular/core";
import {Word} from "../../domain/word";
import {WordService} from "../../services/word/word.service";
import {UserService} from "../../services/user/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-words',
  templateUrl: './words.component.html',
  styleUrls: ['./words.component.less']
})
export class WordsComponent implements OnInit {

  words: Word[];

  constructor(private userService: UserService,
              private wordService: WordService,
              private router: Router) {
  }

  ngOnInit() {
    this.userService.signInIfNot();
    this.wordService.getFullWordsListStream()
      .subscribe(wordsPromise => {
        wordsPromise
          .then(words => this.words = words);
      });
  }

  addWord() {
    this.router.navigate(['/word', 'new']);
  }

  pickWord(wordId) {
    this.router.navigate(['/word', wordId]);
  }
}
