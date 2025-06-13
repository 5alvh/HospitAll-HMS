import { TestBed } from '@angular/core/testing';

import { LabResultService } from './lab-result.service';

describe('LabResultService', () => {
  let service: LabResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LabResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
