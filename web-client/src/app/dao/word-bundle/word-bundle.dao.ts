import {Injectable} from "@angular/core";
import {SecureHttpService} from "../../services/secure-http/secure-http.service";
import {WordBundle} from "../../domain/word-bundle";
import {Observable} from "rxjs";
import {Response} from "@angular/http";

@Injectable()
export class WordBundleDao {

  constructor(private secureHttpService: SecureHttpService) {
  }

  loadFullWordBundleList(): Observable<WordBundle[]> {
    return this.secureHttpService.get('word-bundles')
      .map(response => response.json() as WordBundle[]);
  }

  loadWordBundle(wordBundleId: number): Observable<WordBundle> {
    return this.secureHttpService.get(`word-bundle/${wordBundleId}`)
      .map(response => response.json() as WordBundle);
  }

  addWordBundle(wordBundle: WordBundle): Observable<WordBundle> {
    return this.secureHttpService.post('word-bundle', wordBundle)
      .map(response => response.json() as WordBundle);
  }

  updateWordBundle(wordBundle: WordBundle): Observable<WordBundle> {
    return this.secureHttpService.put(`word-bundle/${wordBundle.id}`, wordBundle)
      .map(response => response.json() as WordBundle);
  }

  addWordToBundle(wordBundleId: number, wordId: number): Observable<Response> {
    return this.secureHttpService.put(`word-bundle/${wordBundleId}/word/${wordId}`);
  }

}
