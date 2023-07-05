import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymnetsuccessComponent } from './paymnetsuccess.component';

describe('PaymnetsuccessComponent', () => {
  let component: PaymnetsuccessComponent;
  let fixture: ComponentFixture<PaymnetsuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymnetsuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymnetsuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
