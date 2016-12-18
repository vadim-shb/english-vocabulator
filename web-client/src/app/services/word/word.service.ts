import {Injectable} from "@angular/core";
import {Word} from "../../domain/word";
import "rxjs/add/operator/toPromise";
import "rxjs/Rx";
import {ErrorHandleService} from "../error-handle/error-handle.service";
import {SecureHttpService} from "../secure-http/secure-http.service";
import {Observable, BehaviorSubject} from "rxjs";

@Injectable()
export class WordService {

  private fullWordListStream: BehaviorSubject<Promise<Word[]>> = new BehaviorSubject<Promise<Word[]>>(this.getFullWordsList());

  constructor(private secureHttpService: SecureHttpService,
              private errorHandleService: ErrorHandleService) {
  }

  private wordsListChanged() {
    this.loadFullWordListToStream();
  }

  private loadFullWordListToStream() {
    this.fullWordListStream.next(this.getFullWordsList());
  }

  saveWord(word: Word): Promise<Word> {
    if (typeof word.id === 'undefined') {
      return this.secureHttpService.post('word', word)
        .then(response => response.json() as Word)
        .then(word => {
          this.wordsListChanged();
          return word;
        })
        .catch(this.errorHandleService.handleHttpError);
    } else {
      return this.secureHttpService.put(`word/${word.id}`, word)
        .then(response => word) //fixme: is this hack appropreate?
        .then(word => {
          this.wordsListChanged();
          return word;
        })
        .catch(this.errorHandleService.handleHttpError);
    }
  }

  getFullWordsListStream(): Observable<Promise<Word[]>> {
    return this.fullWordListStream;
  }

  getFullWordsList(): Promise<Word[]> {
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
