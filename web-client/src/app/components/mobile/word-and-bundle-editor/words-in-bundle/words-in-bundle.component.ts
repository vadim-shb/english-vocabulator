import {Component, OnInit, Input} from "@angular/core";
import {Word} from "../../../../domain/word";
import {WordAndBundleEditorService} from "../../../component-services/word-and-bundle-editor/word-and-bundle-editor.service";
import {
  WordsInBundleService,
  WordsListMode
} from "../../../component-services/word-and-bundle-editor/words-in-bundle/words-in-bundle.service";
import {Subject} from "rxjs";
import {WordBundleScreen} from "../word-and-bundle-editor.component";


@Component({
  selector: 'words-in-bundle',
  templateUrl: './words-in-bundle.component.html',
  styleUrls: ['./words-in-bundle.component.less']
})
export class WordsInBundleComponent implements OnInit {
  private wordsListMode = WordsListMode;

  @Input() currentScreenSubj: Subject<WordBundleScreen>;

  constructor(private wordsInBundleService: WordsInBundleService,
              private wordAndBundleEditorService: WordAndBundleEditorService) {
  }

  ngOnInit() {
  }

  setMode(mode: WordsListMode) {
    this.wordsInBundleService.setMode(mode);
  }

  addWord() {
    this.wordsInBundleService.addWord();
  }

  pickWord(word: Word) {
    this.wordsInBundleService.activateWord(word);
  }

  unbindWordFromBundle() {
    this.wordsInBundleService.unbindWordFromBundle();
  }

  bindWordToBundle() {
    this.wordsInBundleService.bindWordToBundle();
  }

  editWord() {
    this.wordAndBundleEditorService.activeWordSubj.first().subscribe(activeWord => {
      this.wordAndBundleEditorService.editWordSubj.next(activeWord);
    });
  }

  backToWordBundlesList() {
    this.currentScreenSubj.next(WordBundleScreen.PICK_WORD_BUNDLE);
  }
}
