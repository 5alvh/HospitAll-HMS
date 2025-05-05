import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableBedsComponent } from './available-beds.component';

describe('AvailableBedsComponent', () => {
  let component: AvailableBedsComponent;
  let fixture: ComponentFixture<AvailableBedsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailableBedsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailableBedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
