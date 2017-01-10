/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WordAndBundleEditorService } from './word-and-bundle-editor.service';

describe('WordAndBundleEditorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WordAndBundleEditorService]
    });
  });

  it('should ...', inject([WordAndBundleEditorService], (service: WordAndBundleEditorService) => {
    expect(service).toBeTruthy();
  }));
});
