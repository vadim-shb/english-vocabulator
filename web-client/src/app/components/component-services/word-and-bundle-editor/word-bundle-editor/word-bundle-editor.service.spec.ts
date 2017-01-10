/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WordBundleEditorService } from './word-bundle-editor.service';

describe('WordBundleEditorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WordBundleEditorService]
    });
  });

  it('should ...', inject([WordBundleEditorService], (service: WordBundleEditorService) => {
    expect(service).toBeTruthy();
  }));
});
