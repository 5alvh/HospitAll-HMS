import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientAdmissionsComponent } from './patient-admissions.component';

describe('PatientAdmissionsComponent', () => {
  let component: PatientAdmissionsComponent;
  let fixture: ComponentFixture<PatientAdmissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientAdmissionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientAdmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
