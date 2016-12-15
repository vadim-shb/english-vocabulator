import {Injectable} from "@angular/core";
import {Http, Response, Headers} from "@angular/http";
import {UserService} from "../user/user.service";
import {Observable} from "rxjs";
import {Router} from "@angular/router";

@Injectable()
export class SecureHttpService {

  constructor(private http: Http,
              private router: Router,
              private userService: UserService) {
  }

  put(url: string, data: Object): Observable<Response> {
    let user = this.userService.getUser();
    if (user) {
      console.log(data);
      return this.http.put(`/api/user/${user.id}/${url}`, data, {headers: new Headers({'Authorization' : user.accessToken})});
    }
    else {
      this.notLoggedInUserErrorHandler();
    }
  }

  private notLoggedInUserErrorHandler(): void {
    this.router.navigate(['/login']);
  }

}
