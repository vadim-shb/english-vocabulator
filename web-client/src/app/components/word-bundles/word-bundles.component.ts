import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user/user.service";

@Component({
  selector: 'app-word-bundles',
  templateUrl: './word-bundles.component.html',
  styleUrls: ['./word-bundles.component.less']
})
export class WordBundlesComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.signInIfNot();
  }

}
