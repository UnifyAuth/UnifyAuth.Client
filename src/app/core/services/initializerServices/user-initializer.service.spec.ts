import { TestBed } from '@angular/core/testing';

import { UserInitializerService } from './user-initializer.service';

describe('UserInitializerService', () => {
  let service: UserInitializerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserInitializerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
