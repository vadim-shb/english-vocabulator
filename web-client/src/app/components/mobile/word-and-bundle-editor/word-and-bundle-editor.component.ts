import {Component, OnInit} from "@angular/core";
import {UserService} from "../../../services/user/user.service";
import {BehaviorSubject} from "rxjs";
import {WordAndBundleEditorService} from "../../component-services/word-and-bundle-editor/word-and-bundle-editor.service";

export enum WordBundleScreen {
  PICK_WORD_BUNDLE,
  EDIT_WORD_BUNDLE,
  PICK_WORD,
  EDIT_WORD
}

@Component({
  selector: 'word-and-bundle-editor',
  templateUrl: './word-and-bundle-editor.component.html',
  styleUrls: ['./word-and-bundle-editor.component.less']
})
export class WordAndBundleEditorComponent implements OnInit {
  private wordBundleScreen = WordBundleScreen;

  private currentScreenSubj = new BehaviorSubject<WordBundleScreen>(WordBundleScreen.PICK_WORD_BUNDLE);

  constructor(private userService: UserService,
              private wordAndBundleEditorService: WordAndBundleEditorService) {
  }

  ngOnInit() {
    this.userService.signInIfNot();

    this.wordAndBundleEditorService.editWordBundleSubj.subscribe(editWordBundle => {
      if (editWordBundle) {
        this.currentScreenSubj.next(WordBundleScreen.EDIT_WORD_BUNDLE);
      } else {
        this.currentScreenSubj.next(WordBundleScreen.PICK_WORD_BUNDLE);
      }
    });

    this.wordAndBundleEditorService.editWordSubj.subscribe(editWord => {
      if (editWord) {
        this.currentScreenSubj.next(WordBundleScreen.EDIT_WORD);
      } else {
        this.currentScreenSubj.next(WordBundleScreen.PICK_WORD);
      }
    });
  }

}
