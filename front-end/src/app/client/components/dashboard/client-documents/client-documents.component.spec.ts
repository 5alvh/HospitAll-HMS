import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientDocumentsComponent } from './client-documents.component';

describe('ClientDocumentsComponent', () => {
  let component: ClientDocumentsComponent;
  let fixture: ComponentFixture<ClientDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientDocumentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
