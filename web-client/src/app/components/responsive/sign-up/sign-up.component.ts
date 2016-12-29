import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {SecurityService} from "../../../services/security/security.service";
import {SecurityEmailPasswordCredentials} from "../../../domain/security";

@Component({
  selector: 'sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.less']
})
export class SignUpComponent implements OnInit {

  credentials: SecurityEmailPasswordCredentials = {
    email: '',
    password: ''
  };

  constructor(private securityService: SecurityService,
              private router: Router) {
  }

  ngOnInit() {
  }

  signUp() {
    this.securityService.signUp(this.credentials)
      .then(() => this.router.navigate(['/dashboard']));
  }

}
