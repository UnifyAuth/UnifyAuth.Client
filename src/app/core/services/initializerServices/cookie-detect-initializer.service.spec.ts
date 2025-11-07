import { TestBed } from '@angular/core/testing';

import { CookieDetectInitializerService } from './cookie-detect-initializer.service';

describe('CookieDetectInitializerService', () => {
  let service: CookieDetectInitializerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CookieDetectInitializerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
