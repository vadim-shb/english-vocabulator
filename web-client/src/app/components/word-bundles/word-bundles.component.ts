import {Component, OnInit} from "@angular/core";
import {UserService} from "../../services/user/user.service";
import {Observable, BehaviorSubject} from "rxjs";
import {WordBundle} from "../../domain/word-bundle";
import {WordBundleService} from "../../services/word-bundle/word-bundle.service";

@Component({
  selector: 'app-word-bundles',
  templateUrl: './word-bundles.component.html',
  styleUrls: ['./word-bundles.component.less']
})
export class WordBundlesComponent implements OnInit {

  activeWordBundleSubj: BehaviorSubject<WordBundle> = new BehaviorSubject<WordBundle>({name: '', importance: 5, words: []});
  wordBundlesObs: Observable<WordBundle[]>;

  constructor(private userService: UserService,
              private wordBundleService: WordBundleService
  ) {
  }

  ngOnInit() {
     this.userService.signInIfNot();
     this.wordBundlesObs = this.wordBundleService.getWordBundles();
  }

}
