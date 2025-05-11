import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalPatientComponent } from './total-patient.component';

describe('TotalPatientComponent', () => {
  let component: TotalPatientComponent;
  let fixture: ComponentFixture<TotalPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalPatientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
