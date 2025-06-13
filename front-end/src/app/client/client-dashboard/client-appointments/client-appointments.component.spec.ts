import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAppointmentsComponent } from './client-appointments.component';

describe('ClientAppointmentsComponent', () => {
  let component: ClientAppointmentsComponent;
  let fixture: ComponentFixture<ClientAppointmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientAppointmentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
