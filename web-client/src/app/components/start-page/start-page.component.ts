import {Component, OnInit} from "@angular/core";
import {SecurityEmailPasswordCredentials} from "../../domain/security-email-password-credentials";
import {Http} from "@angular/http";
import "rxjs/add/operator/toPromise";
import {Router} from "@angular/router";

@Component({
  selector: 'start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.less']
})
export class StartPageComponent implements OnInit {

  title = 'Very First Page!';
  credentials: SecurityEmailPasswordCredentials = {
    email: '',
    password: ''
  };

  constructor(private http: Http,
              private router: Router) {}

  ngOnInit() {
  }

  signIn() {
    this.http.post('/api/security/sign-in', this.credentials)
      .toPromise()
      .then(() => this.router.navigate(['/dashboard']))
      .catch((error) => this.router.navigate(['/error']));
  }
}
