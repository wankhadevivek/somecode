import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectpaymentComponent } from './collectpayment.component';

describe('CollectpaymentComponent', () => {
  let component: CollectpaymentComponent;
  let fixture: ComponentFixture<CollectpaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectpaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectpaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
