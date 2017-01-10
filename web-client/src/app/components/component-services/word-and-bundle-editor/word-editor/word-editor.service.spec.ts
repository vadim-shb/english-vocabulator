/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WordEditorService } from './word-editor.service';

describe('WordEditorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WordEditorService]
    });
  });

  it('should ...', inject([WordEditorService], (service: WordEditorService) => {
    expect(service).toBeTruthy();
  }));
});
