import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {Response} from "@angular/http";
import {Observable} from "rxjs";
import {UserService} from "../user/user.service";

@Injectable()
export class ErrorHandleService {

  constructor(private router: Router,
              private userService: UserService) {
  }

  catchHttpError(response: Response): Observable<Response> {
    if (response.status == 403) {
      this.userService.clearUser();
      this.router.navigate(['/sign-in']);
      throw "user must be signed in";
    }
    if (response.status == 500) {
      this.router.navigate(['/error']);
    }
    return Observable.never();
  }
}
