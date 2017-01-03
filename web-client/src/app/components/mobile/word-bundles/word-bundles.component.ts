import {Component, OnInit} from "@angular/core";
import {UserService} from "../../../services/user/user.service";
import {ReplaySubject, Subscription} from "rxjs";
import {WordBundle} from "../../../domain/word-bundle";
import {Word} from "../../../domain/word";
import {WordService} from "../../../services/word/word.service";

@Component({
  selector: 'app-word-bundles',
  templateUrl: './word-bundles.component.html',
  styleUrls: ['./word-bundles.component.less']
})
export class WordBundlesComponent implements OnInit {

  private editWordBundleSubj = new ReplaySubject<WordBundle>(1);
  private activeWordBundleSubj = new ReplaySubject<WordBundle>(1);
  private activeWordSubj = new ReplaySubject<Word>(1);

  private activeWordCurrentSubscription: Subscription;

  constructor(private userService: UserService,
              private wordService: WordService) {
  }

  ngOnInit() {
    this.userService.signInIfNot();

    this.activeWordSubj.subscribe(word => {
      if (word && word.id) {
        this.activeWordCurrentSubscription = this.wordService.getWord(word.id).subscribe(
          () => {},
          () => {},
          () => {
            this.activeWordSubj.next(undefined);
            this.activeWordCurrentSubscription.unsubscribe();
          })
      }
    });
  }

}
