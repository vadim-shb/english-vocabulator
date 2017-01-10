import {Component, OnInit} from "@angular/core";
import {UserService} from "../../../services/user/user.service";
import {WordAndBundleEditorService} from "../../component-services/word-and-bundle-editor/word-and-bundle-editor.service";

@Component({
  selector: 'word-and-bundle-editor',
  templateUrl: './word-and-bundle-editor.component.html',
  styleUrls: ['./word-and-bundle-editor.component.less']
})
export class WordAndBundleEditorComponent implements OnInit {

  constructor(private userService: UserService,
              private wordAndBundleEditorService: WordAndBundleEditorService) {
  }

  ngOnInit() {
    this.userService.signInIfNot();
  }

}
