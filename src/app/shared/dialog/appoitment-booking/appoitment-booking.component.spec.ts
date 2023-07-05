import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppoitmentBookingComponent } from './appoitment-booking.component';

describe('AppoitmentBookingComponent', () => {
  let component: AppoitmentBookingComponent;
  let fixture: ComponentFixture<AppoitmentBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppoitmentBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppoitmentBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
