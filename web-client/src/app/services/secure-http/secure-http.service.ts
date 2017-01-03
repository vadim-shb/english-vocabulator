import {Injectable} from "@angular/core";
import {Http, Response, Headers, RequestOptionsArgs} from "@angular/http";
import {UserService} from "../user/user.service";
import {Router} from "@angular/router";
import {User} from "../../domain/user";
import {Observable} from "rxjs";
import {ErrorHandleService} from "../error-handle/error-handle.service";

@Injectable()
export class SecureHttpService {

  constructor(private http: Http,
              private router: Router,
              private userService: UserService,
              private errorHandleService: ErrorHandleService) {
  }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    let user = this.userService.getUser();
    if (user) {
      return this.http.get(`/api/user/${user.id}/${url}`, SecureHttpService.modifyOptions(user, options))
        .catch(response => this.errorHandleService.catchHttpError(response))
    }
    else {
      this.notSignedInUserErrorHandler();
      return Observable.empty() as Observable<Response>;
    }
  }

  post(url: string, data?: Object, options?: RequestOptionsArgs): Observable<Response> {
    let user = this.userService.getUser();
    if (user) {
      return this.http.post(`/api/user/${user.id}/${url}`, data, SecureHttpService.modifyOptions(user, options))
        .catch(response => this.errorHandleService.catchHttpError(response));
    }
    else {
      this.notSignedInUserErrorHandler();
      return Observable.empty() as Observable<Response>;
    }
  }

  put(url: string, data?: Object, options?: RequestOptionsArgs): Observable<Response> {
    let user = this.userService.getUser();
    if (user) {
      return this.http.put(`/api/user/${user.id}/${url}`, data, SecureHttpService.modifyOptions(user, options))
        .catch(response => this.errorHandleService.catchHttpError(response))
    }
    else {
      this.notSignedInUserErrorHandler();
      return Observable.empty() as Observable<Response>;
    }
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    let user = this.userService.getUser();
    if (user) {
      return this.http.delete(`/api/user/${user.id}/${url}`, SecureHttpService.modifyOptions(user, options))
        .catch(response => this.errorHandleService.catchHttpError(response))
    }
    else {
      this.notSignedInUserErrorHandler();
      return Observable.empty() as Observable<Response>;
    }
  }

  private notSignedInUserErrorHandler(): void {
    this.router.navigate(['/sign-in']);
  }

  private static modifyOptions(user: User, options?: RequestOptionsArgs): RequestOptionsArgs {
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
