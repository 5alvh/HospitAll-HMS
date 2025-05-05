import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepStatusComponent } from './dep-status.component';

describe('DepStatusComponent', () => {
  let component: DepStatusComponent;
  let fixture: ComponentFixture<DepStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
