export class WordBundle {
  id?: number;
  name: string;
  importance: number;
  wordIds: number[];

  static wordBundleAscNameComparator(wordBundle1: WordBundle, wordBundle2: WordBundle): number {
    if (wordBundle1.name > wordBundle2.name) return 1;
    if (wordBundle1.name < wordBundle2.name) return -1;
    if (wordBundle1.name == wordBundle2.name) return wordBundle1.id - wordBundle2.id;
  }
}
