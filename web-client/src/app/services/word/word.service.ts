import {Injectable} from "@angular/core";
import {Word} from "../../domain/word";
import "rxjs/add/operator/toPromise";
import {ErrorHandleService} from "../error-handle/error-handle.service";
import {SecureHttpService} from "../secure-http/secure-http.service";

@Injectable()
export class WordService {

  constructor(private secureHttpService: SecureHttpService,
              private errorHandleService: ErrorHandleService) {
  }

  addWord(word: Word): Promise<Word> {
    return this.secureHttpService.put('word', word)
      .toPromise()
      .then(response => response.json() as Word)
      .catch((error) => this.errorHandleService.handleHttpError(error));
  }

  getMyWords(): Promise<Word[]> {
    return this.secureHttpService.get('words')
      .toPromise()
      .then(response => response.json() as Word[])
      .catch((error) => this.errorHandleService.handleHttpError(error));
  }
}
