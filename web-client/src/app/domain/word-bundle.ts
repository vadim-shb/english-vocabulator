import {Word} from "./word";

export class WordBundle {
  id?: number;
  name: string;
  importance: number;
  words: Word[];
}
