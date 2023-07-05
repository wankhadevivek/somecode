import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterSaleComponent } from './counter-sale.component';

describe('CounterSaleComponent', () => {
  let component: CounterSaleComponent;
  let fixture: ComponentFixture<CounterSaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CounterSaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
