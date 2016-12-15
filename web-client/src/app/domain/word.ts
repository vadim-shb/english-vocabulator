import {WordMeaning} from "./word-meaning";
export class Word {
  id: number;
  word: string;
  meanings: WordMeaning[];
  importance: number;
}
