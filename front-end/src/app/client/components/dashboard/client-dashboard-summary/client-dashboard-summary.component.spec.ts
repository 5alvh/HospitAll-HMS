import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientDashboardSummaryComponent } from './client-dashboard-summary.component';

describe('ClientDashboardSummaryComponent', () => {
  let component: ClientDashboardSummaryComponent;
  let fixture: ComponentFixture<ClientDashboardSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientDashboardSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientDashboardSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
