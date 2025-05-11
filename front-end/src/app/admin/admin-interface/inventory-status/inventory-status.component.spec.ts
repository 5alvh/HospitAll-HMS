import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryStatusComponent } from './inventory-status.component';

describe('InventoryStatusComponent', () => {
  let component: InventoryStatusComponent;
  let fixture: ComponentFixture<InventoryStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
