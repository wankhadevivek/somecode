import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierPurchaseOrder } from './supplier-purchase-order.component';

describe('PurchaseOrderComponent', () => {
  let component: SupplierPurchaseOrder;
  let fixture: ComponentFixture<SupplierPurchaseOrder>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierPurchaseOrder ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierPurchaseOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
