export class Word {
  id?: number;
  word: string;
  importance: number;
  meaning: string;
  usageExamples: string;

  static wordAscAlphabeticalComparator(word1: Word, word2: Word): number {
    if (word1.word > word2.word) return 1;
    if (word1.word < word2.word) return -1;
    if (word1.word == word2.word) return word1.id - word2.id;
  }

  static wordDecImportanceComparator(word1: Word, word2: Word): number {
    if (word1.importance < word2.importance) return 1;
    if (word1.importance > word2.importance) return -1;
    if (word1.importance == word2.importance) return word1.id - word2.id;
  }
}
