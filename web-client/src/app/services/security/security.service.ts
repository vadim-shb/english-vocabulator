import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {User} from "../../domain/user";
import {ErrorHandleService} from "../error-handle/error-handle.service";
import "rxjs/add/operator/toPromise";
import {UserService} from "../user/user.service";
import {SecurityAuthenticationResponse, SecurityEmailPasswordCredentials} from "../../domain/security";

@Injectable()
export class SecurityService {

  constructor(private http: Http,
              private errorHandleService: ErrorHandleService,
              private userService: UserService) {
  }

  signIn(credentials: SecurityEmailPasswordCredentials) {
    return this.http.post('/api/security/sign-in', credentials)
      .catch(response => this.errorHandleService.catchHttpError(response))
      .toPromise()
      .then(response => {
        let authenticationResponse = response.json() as SecurityAuthenticationResponse;
        let user: User = {
          id: authenticationResponse.user.id,
          accessToken: authenticationResponse.accessToken
        };
        this.userService.setUser(user);
        return user;
      })
  }

  signUp(credentials: SecurityEmailPasswordCredentials) {
    return this.http.post('/api/security/sign-up', credentials)
      .catch(response => this.errorHandleService.catchHttpError(response))
      .toPromise()
      .then(response => {
        let authenticationResponse = response.json() as SecurityAuthenticationResponse;
        let user: User = {
          id: authenticationResponse.user.id,
          accessToken: authenticationResponse.accessToken
        };
        this.userService.setUser(user);
        return user;
      })
  }
}