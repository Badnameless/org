import { TestBed } from '@angular/core/testing';

import { EncfServiceService } from './encf-service.service';

describe('EncfServiceService', () => {
  let service: EncfServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EncfServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
