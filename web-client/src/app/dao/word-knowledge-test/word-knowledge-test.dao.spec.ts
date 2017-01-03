/* tslint:disable:no-unused-variable */
import {TestBed, inject} from "@angular/core/testing";
import {WordKnowledgeTestDao} from "./word-knowledge-test.dao";

describe('WordKnowledgeTestDao', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WordKnowledgeTestDao]
    });
  });

  it('should ...', inject([WordKnowledgeTestDao], (service: WordKnowledgeTestDao) => {
    expect(service).toBeTruthy();
  }));
});
