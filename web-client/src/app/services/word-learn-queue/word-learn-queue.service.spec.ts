/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WordLearnQueueService } from './word-learn-queue.service';

describe('WordLearnQueueService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WordLearnQueueService]
    });
  });

  it('should ...', inject([WordLearnQueueService], (service: WordLearnQueueService) => {
    expect(service).toBeTruthy();
  }));
});
