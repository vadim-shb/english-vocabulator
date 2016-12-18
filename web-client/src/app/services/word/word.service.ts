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

  saveWord(word: Word): Promise<Word> {
    if (typeof word.id === 'undefined') {
      return this.secureHttpService.post('word', word)
        .then(response => response.json() as Word)
        .catch(this.errorHandleService.handleHttpError);
    } else {
      return this.secureHttpService.put(`word/${word.id}`, word)
        .then(response => word)
        .catch(this.errorHandleService.handleHttpError);
    }
  }

  getMyWords(): Promise<Word[]> {
    return this.secureHttpService.get('words')
      .then(response => response.json() as Word[])
      .catch(this.errorHandleService.handleHttpError);
  }

  getWord(wordId: number): Promise<Word> {
    return this.secureHttpService.get(`word/${wordId}`)
      .then(response => response.json() as Word)
      .catch(this.errorHandleService.handleHttpError);
  }
}
