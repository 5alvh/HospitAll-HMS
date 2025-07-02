import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPrescriptionsComponent } from './client-prescriptions.component';

describe('ClientPrescriptionsComponent', () => {
  let component: ClientPrescriptionsComponent;
  let fixture: ComponentFixture<ClientPrescriptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientPrescriptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientPrescriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
