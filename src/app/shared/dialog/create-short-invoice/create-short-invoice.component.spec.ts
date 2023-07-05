import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateShortInvoiceComponent } from './create-short-invoice.component';

describe('CreateShortInvoiceComponent', () => {
  let component: CreateShortInvoiceComponent;
  let fixture: ComponentFixture<CreateShortInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateShortInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateShortInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
