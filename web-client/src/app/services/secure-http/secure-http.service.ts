import {Injectable} from "@angular/core";
import {Http, Response, Headers, RequestOptionsArgs} from "@angular/http";
import {UserService} from "../user/user.service";
import {Router} from "@angular/router";
import {User} from "../../domain/user";

@Injectable()
export class SecureHttpService {

  constructor(private http: Http,
              private router: Router,
              private userService: UserService) {
  }

  get(url: string, options?: RequestOptionsArgs): Promise<Response> {
    let user = this.userService.getUser();
    if (user) {
      return this.http.get(`/api/user/${user.id}/${url}`, this.modifyOptions(user, options))
        .toPromise()
        .then(this.signInChecker)
    }
    else {
      this.notSignedInUserErrorHandler();
    }
  }

  post(url: string, data: Object, options?: RequestOptionsArgs) : Promise<Response>{
    let user = this.userService.getUser();
    if (user) {
      return this.http.post(`/api/user/${user.id}/${url}`, data, this.modifyOptions(user, options))
        .toPromise()
        .then(this.signInChecker)
    }
    else {
      this.notSignedInUserErrorHandler();
    }
  }

  put(url: string, data: Object, options?: RequestOptionsArgs): Promise<Response> {
    let user = this.userService.getUser();
    if (user) {
      return this.http.put(`/api/user/${user.id}/${url}`, data, this.modifyOptions(user, options))
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

  private modifyOptions(user: User, options?: RequestOptionsArgs):RequestOptionsArgs {
    let result: RequestOptionsArgs;
    if (options) {
      result = Object.assign({}, options);
      if (result.headers) {
        result.headers.append('Authorization', user.accessToken);
      } else {
        result.headers = new Headers({'Authorization': user.accessToken});
      }
    } else {
      result = {headers: new Headers({'Authorization': user.accessToken})};
    }
    return result;
  }

}
