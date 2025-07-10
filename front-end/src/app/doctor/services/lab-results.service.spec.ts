import { TestBed } from '@angular/core/testing';

import { LabResultsService } from './lab-results.service';

describe('LabResultsService', () => {
  let service: LabResultsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LabResultsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
