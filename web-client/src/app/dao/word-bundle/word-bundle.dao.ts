import {Injectable} from "@angular/core";
import {SecureHttpService} from "../../services/secure-http/secure-http.service";
import {WordBundle} from "../../domain/word-bundle";

@Injectable()
export class WordBundleDao {

  constructor(private secureHttpService: SecureHttpService) {
  }

  loadWordBundles(): Promise<WordBundle[]> {
    return this.secureHttpService.get('word-bundles')
      .then(response => response.json() as WordBundle[]);
  }

  addWordBundle(wordBundle: WordBundle): Promise<WordBundle> {
    return this.secureHttpService.post('word-bundle', wordBundle)
      .then(response => response.json() as WordBundle);
  }


}
