/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WordBundlePickerService } from './word-bundle-picker.service';

describe('WordBundlePickerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WordBundlePickerService]
    });
  });

  it('should ...', inject([WordBundlePickerService], (service: WordBundlePickerService) => {
    expect(service).toBeTruthy();
  }));
});
