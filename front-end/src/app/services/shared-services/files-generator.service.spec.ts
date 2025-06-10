import { TestBed } from '@angular/core/testing';

import { FilesGeneratorService } from './files-generator.service';

describe('FilesGeneratorService', () => {
  let service: FilesGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilesGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
