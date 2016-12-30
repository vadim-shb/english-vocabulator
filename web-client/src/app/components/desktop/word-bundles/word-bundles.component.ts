import {Component, OnInit} from "@angular/core";
import {UserService} from "../../../services/user/user.service";
import {ReplaySubject} from "rxjs";
import {WordBundle} from "../../../domain/word-bundle";
import {Word} from "../../../domain/word";

@Component({
  selector: 'app-word-bundles',
  templateUrl: './word-bundles.component.html',
  styleUrls: ['./word-bundles.component.less']
})
export class WordBundlesComponent implements OnInit {

  private editWordBundleSubj = new ReplaySubject<WordBundle>(1);
  private activeWordBundleSubj = new ReplaySubject<WordBundle>(1);
  private activeWordInBundleSubj = new ReplaySubject<Word>(1);

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.userService.signInIfNot();
  }

}
