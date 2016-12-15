import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user/user.service";

@Component({
  selector: 'app-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.less']
})
export class LearningComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.logInIfNot();
  }

}
