import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../services/user/user.service";

@Component({
  selector: 'desktop-root',
  templateUrl: './desktop-root.component.html',
  styleUrls: ['./desktop-root.component.less']
})
export class DesktopRootComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.signInIfNot();
  }

}
