import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {UserService} from "../../../services/user/user.service";
import {SecureHttpService} from "../../../services/secure-http/secure-http.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  constructor(private secureHttpService: SecureHttpService,
              private router: Router,
              private userService: UserService) {
  }

  ngOnInit() {
  }

  signOut() {
    this.secureHttpService.get('security/sign-out')
      .subscribe(() => {
        this.userService.clearUser();
        this.router.navigate(['/sign-in']);
      });
  }
}
