import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndUserPaymentComponent } from './end-user-payment.component';

describe('EndUserPaymentComponent', () => {
  let component: EndUserPaymentComponent;
  let fixture: ComponentFixture<EndUserPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndUserPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndUserPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
