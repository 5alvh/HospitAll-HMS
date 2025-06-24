import { TestBed } from '@angular/core/testing';

import { NotificationUnseenService } from './notification-unseen.service';

describe('NotificationUnseenService', () => {
  let service: NotificationUnseenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationUnseenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
