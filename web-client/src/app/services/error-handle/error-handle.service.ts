import { Injectable } from '@angular/core';
import {Router} from "@angular/router";

@Injectable()
export class ErrorHandleService {

  constructor(private router: Router) { }

  handleHttpError(error: any) {
    console.log(error);
    this.router.navigate(['/error'])
  }
}
