import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientNotificationsComponent } from './client-notifications.component';

describe('ClientNotificationsComponent', () => {
  let component: ClientNotificationsComponent;
  let fixture: ComponentFixture<ClientNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientNotificationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
