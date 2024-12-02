import { TestBed } from '@angular/core/testing';

import { CalzoneService } from './calzone.service';

describe('CalzoneService', () => {
  let service: CalzoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalzoneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
