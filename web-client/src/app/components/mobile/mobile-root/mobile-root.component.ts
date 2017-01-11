import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../services/user/user.service";

@Component({
  selector: 'mobile-root',
  templateUrl: './mobile-root.component.html',
  styleUrls: ['./mobile-root.component.less']
})
export class MobileRootComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.signInIfNot();
  }

}
