import {Injectable} from "@angular/core";
import {Http, Response, Headers} from "@angular/http";
import {UserService} from "../user/user.service";
import {Router} from "@angular/router";

@Injectable()
export class SecureHttpService {

  constructor(private http: Http,
              private router: Router,
              private userService: UserService) {
  }

  get(url: string): Promise<Response> {
    let user = this.userService.getUser();
    if (user) {
      return this.http.get(`/api/user/${user.id}/${url}`, {headers: new Headers({'Authorization': user.accessToken})})
        .toPromise()
        .then(this.signInChecker)
    }
    else {
      this.notSignedInUserErrorHandler();
    }
  }

  put(url: string, data: Object): Promise<Response> {
    let user = this.userService.getUser();
    if (user) {
      return this.http.put(`/api/user/${user.id}/${url}`, data, {headers: new Headers({'Authorization': user.accessToken})})
        .toPromise()
        .then(this.signInChecker)
    }
    else {
      this.notSignedInUserErrorHandler();
    }
  }

  private notSignedInUserErrorHandler(): void {
    this.router.navigate(['/sign-in']);
  }

  private signInChecker(response: Response): Response {
    if (response.status == 403) {
      this.notSignedInUserErrorHandler();
      throw "user must be signed in";
    }
    return response
  }
}
