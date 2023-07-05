import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceEstimatePoComponent } from './invoice-estimate-po.component';

describe('InvoiceStimatePoComponent', () => {
  let component: InvoiceEstimatePoComponent;
  let fixture: ComponentFixture<InvoiceEstimatePoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceEstimatePoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceEstimatePoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
