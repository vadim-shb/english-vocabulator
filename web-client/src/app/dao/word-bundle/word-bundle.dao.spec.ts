/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import {WordBundleDao} from "./word-bundle.dao";

describe('WordBundleDao', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WordBundleDao]
    });
  });

  it('should ...', inject([WordBundleDao], (service: WordBundleDao) => {
    expect(service).toBeTruthy();
  }));
});
