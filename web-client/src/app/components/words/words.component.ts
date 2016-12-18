import {Component, OnInit} from "@angular/core";
import {Word} from "../../domain/word";
import {WordService} from "../../services/word/word.service";
import {UserService} from "../../services/user/user.service";
import {Router, ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'app-words',
  templateUrl: './words.component.html',
  styleUrls: ['./words.component.less']
})
export class WordsComponent implements OnInit {

  words: Word[];
  selectedWordId: number;

  constructor(private userService: UserService,
              private wordService: WordService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.userService.signInIfNot();
    this.wordService.getFullWordsListStream()
      .subscribe(wordsPromise => {
        wordsPromise
          .then(words => this.words = words.sort((word1, word2) => {
            if (word1.word > word2.word) return 1;
            if (word1.word < word2.word) return -1;
            return 0;
          }));
      });
    this.route.params.subscribe((params: Params) => {
      this.selectedWordId = params['wordId'];
    });
  }

  addWord() {
    this.router.navigate(['/word', 'new']);
  }

  pickWord(wordId: number) {
    this.router.navigate(['/word', wordId]);
  }
}
