/* tslint:disable:no-unused-variable */
import {TestBed, inject} from "@angular/core/testing";
import {WordKnowledgeTestService} from "./word-knowledge-test.service";

describe('WordKnowledgeTestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WordKnowledgeTestService]
    });
  });

  it('should ...', inject([WordKnowledgeTestService], (service: WordKnowledgeTestService) => {
    expect(service).toBeTruthy();
  }));
});
