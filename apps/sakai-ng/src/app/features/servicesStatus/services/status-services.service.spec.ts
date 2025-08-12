import { TestBed } from '@angular/core/testing';

import { StatusServicesService } from './status-services.service';

describe('StatusServicesService', () => {
  let service: StatusServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatusServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
