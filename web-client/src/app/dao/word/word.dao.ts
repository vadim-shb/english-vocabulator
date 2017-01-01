import {Injectable} from "@angular/core";
import {SecureHttpService} from "../../services/secure-http/secure-http.service";
import {Word} from "../../domain/word";
import {Observable} from "rxjs";
import {Response} from "@angular/http";

@Injectable()
export class WordDao {

  constructor(private secureHttpService: SecureHttpService) {
  }

  loadFullWordsList(): Observable<Word[]> {
    return this.secureHttpService.get('words')
      .map(response => response.json() as Word[])
  }

  loadWord(wordId: number): Observable<Word> {
    return this.secureHttpService.get(`word/${wordId}`)
      .map(response => response.json() as Word)
  }

  addWord(word: Word): Observable<Word> {
    return this.secureHttpService.post('word', word)
      .map(response => response.json() as Word)
  }


  updateWord(word: Word): Observable<Word> {
    return this.secureHttpService.put(`word/${word.id}`, word)
      .map(response => response.json() as Word)
  }

  removeWord(wordId: number) : Observable<Response> {
    return this.secureHttpService.delete(`word/${wordId}`)
  }
}
