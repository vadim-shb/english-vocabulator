import {Component, OnInit, Input} from "@angular/core";
import {Observable, Subject} from "rxjs";
import {WordBundle} from "../../../../domain/word-bundle";
import {Word} from "../../../../domain/word";
import {WordService} from "../../../../services/word/word.service";
import {EntityUtils} from "../../../../utils/entity-utils";

@Component({
  selector: 'words-in-bundle',
  templateUrl: './words-in-bundle.component.html',
  styleUrls: ['./words-in-bundle.component.less']
})
export class WordsInBundleComponent implements OnInit {

  @Input() activeWordBundleObs: Observable<WordBundle>;
  @Input() activeWordSubj: Subject<Word>;
  private words: Word[];
  private activeWord: Word;

  constructor(private wordService: WordService) {
  }

  ngOnInit() {
    this.activeWordBundleObs.subscribe(wordBundle => {
      if (wordBundle) {
        let wordObservables: Observable<Word>[] = wordBundle.wordIds
          .map(wordId => this.wordService.getWord(wordId));
        let wordsObservable: Observable<Word[]> = EntityUtils.mergeObservables(wordObservables);
        wordsObservable.subscribe(words => {
          this.words = words.sort(Word.wordAscAlphabeticalComparator);
          if (!this.activeWord && this.words[0]) {
            this.activeWordSubj.next(this.words[0])
          }
        });
      }
    });
    this.activeWordSubj.subscribe(word => this.activeWord = word);
  }

  addWord() {
    this.activeWordSubj.next({
      word: '',
      meaning: '',
      usageExamples: '',
      importance: 5
    });
  }

  pickWord(word: Word) {
    this.activeWordSubj.next(word);
  }

}
