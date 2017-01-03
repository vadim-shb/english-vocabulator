/* tslint:disable:no-unused-variable */
import {TestBed, inject} from "@angular/core/testing";
import {WordDao} from "./word.dao";

describe('WordDao', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WordDao]
    });
  });

  it('should ...', inject([WordDao], (service: WordDao) => {
    expect(service).toBeTruthy();
  }));
});
