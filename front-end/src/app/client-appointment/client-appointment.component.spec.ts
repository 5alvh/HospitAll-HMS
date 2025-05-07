import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAppointmentComponent } from './client-appointment.component';

describe('ClientAppointmentComponent', () => {
  let component: ClientAppointmentComponent;
  let fixture: ComponentFixture<ClientAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientAppointmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
