import {Component, OnInit} from "@angular/core";
import {UserService} from "../../services/user/user.service";
import {BehaviorSubject} from "rxjs";
import {WordBundle} from "../../domain/word-bundle";
import {Word} from "../../domain/word";

@Component({
  selector: 'app-word-bundles',
  templateUrl: './word-bundles.component.html',
  styleUrls: ['./word-bundles.component.less']
})
export class WordBundlesComponent implements OnInit {

  activeWordBundleSubj: BehaviorSubject<WordBundle> = new BehaviorSubject<WordBundle>({
    name: '',
    importance: 5,
    wordIds: []
  });
  private activeWordInBundleSubj: BehaviorSubject<Word> = new BehaviorSubject<Word>({
    word: '',
    meaning: '',
    usageExamples: '',
    importance: 5
  });

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.userService.signInIfNot();
  }

}
