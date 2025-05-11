import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayAppointmentsComponent } from './today-appointments.component';

describe('TodayAppointmentsComponent', () => {
  let component: TodayAppointmentsComponent;
  let fixture: ComponentFixture<TodayAppointmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodayAppointmentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodayAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
