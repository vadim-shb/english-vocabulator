import {Injectable} from "@angular/core";
import {User} from "../../domain/user";
import "rxjs/add/operator/toPromise";
import {Router} from "@angular/router";

@Injectable()
export class UserService {

  private user: User;

  constructor(private router: Router) {
    let savedUserJson = localStorage.getItem('user');
    if (savedUserJson) {
      this.user = JSON.parse(savedUserJson) as User;
    }
  }

  getUser(): User {
    return this.user;
  }

  setUser(user: User) {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(this.user));
  }

  signInIfNot(): void {
    if (!this.user) {
      this.router.navigate(['/sign-in']);
    }
  }
}
