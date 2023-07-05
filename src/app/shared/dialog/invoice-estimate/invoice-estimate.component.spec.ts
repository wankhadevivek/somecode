import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceEstimateComponent } from './invoice-estimate.component';

describe('InvoiceEstimateComponent', () => {
  let component: InvoiceEstimateComponent;
  let fixture: ComponentFixture<InvoiceEstimateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceEstimateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceEstimateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
