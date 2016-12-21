/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WordBundleService } from './word-bundle.service';

describe('WordBundleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WordBundleService]
    });
  });

  it('should ...', inject([WordBundleService], (service: WordBundleService) => {
    expect(service).toBeTruthy();
  }));
});
