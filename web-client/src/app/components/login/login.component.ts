import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {SecurityService} from "../../services/security/security.service";
import {SecurityEmailPasswordCredentials} from "../../domain/security";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  credentials: SecurityEmailPasswordCredentials = {
    email: '',
    password: ''
  };

  constructor(private securityService: SecurityService,
              private router: Router) {
  }

  ngOnInit() {
  }

  signIn() {
    this.securityService.signIn(this.credentials)
      .then(() => this.router.navigate(['/dashboard']));
  }
}
