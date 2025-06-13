import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLoadingWrapperComponent } from './client-loading-wrapper.component';

describe('ClientLoadingWrapperComponent', () => {
  let component: ClientLoadingWrapperComponent;
  let fixture: ComponentFixture<ClientLoadingWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientLoadingWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientLoadingWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
