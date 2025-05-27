import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSystemComponent } from './payment-system.component';

describe('PaymentSystemComponent', () => {
  let component: PaymentSystemComponent;
  let fixture: ComponentFixture<PaymentSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentSystemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
