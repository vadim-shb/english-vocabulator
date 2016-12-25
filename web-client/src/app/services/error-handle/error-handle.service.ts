import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {Response} from "@angular/http";

@Injectable()
export class ErrorHandleService {

  constructor(private router: Router) { }

  checkHttpError(response: Response): Response {
    if (response.status == 403) {
      this.router.navigate(['/sign-in']);
      throw "user must be signed in";
    }
    if (response.status == 500) {
      this.router.navigate(['/error'])
    }
    return response
  }
}
