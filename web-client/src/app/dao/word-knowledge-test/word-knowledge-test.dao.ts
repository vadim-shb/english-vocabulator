import {Injectable} from "@angular/core";
import {SecureHttpService} from "../../services/secure-http/secure-http.service";
import {Observable} from "rxjs";
import {
  WordKnowledgeTestResume,
  WordKnowledgeTestResumeDTO,
  WordKnowledgeTestType,
  WordKnowledgeTestResultType
} from "../../domain/word-knowledge-test";

@Injectable()
export class WordKnowledgeTestDao {

  constructor(private secureHttpService: SecureHttpService) {
  }

  addWordKnowledgeTestResume(testResume: WordKnowledgeTestResume): Observable<WordKnowledgeTestResume> {
    let testResumeDTO: WordKnowledgeTestResumeDTO = {
      wordId: testResume.wordId,
      testType: WordKnowledgeTestType[testResume.testType],
      testResult: WordKnowledgeTestResultType[testResume.testResult],
      testDuration: testResume.testDuration
    };

    return this.secureHttpService.post('word-knowledge-test-resume', testResumeDTO)
      .map(response => {
        let testResumeDTO = response.json() as WordKnowledgeTestResumeDTO;
        return {
          id: testResumeDTO.id,
          wordId: testResumeDTO.wordId,
          testType: WordKnowledgeTestType[testResumeDTO.testType],
          testResult: WordKnowledgeTestResultType[testResumeDTO.testResult],
          testDuration: testResumeDTO.testDuration,
        } as WordKnowledgeTestResume
      })
  }
}
