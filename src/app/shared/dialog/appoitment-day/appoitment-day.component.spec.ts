import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppoitmentDayComponent } from './appoitment-day.component';

describe('AppoitmentDayComponent', () => {
  let component: AppoitmentDayComponent;
  let fixture: ComponentFixture<AppoitmentDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppoitmentDayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppoitmentDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
