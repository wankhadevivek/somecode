import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSortComponent } from './order-sort.component';

describe('OrderSortComponent', () => {
  let component: OrderSortComponent;
  let fixture: ComponentFixture<OrderSortComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderSortComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
