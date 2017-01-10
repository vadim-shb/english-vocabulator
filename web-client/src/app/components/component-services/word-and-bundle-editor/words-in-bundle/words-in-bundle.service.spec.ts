/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WordsInBundleService } from './words-in-bundle.service';

describe('WordsInBundleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WordsInBundleService]
    });
  });

  it('should ...', inject([WordsInBundleService], (service: WordsInBundleService) => {
    expect(service).toBeTruthy();
  }));
});
