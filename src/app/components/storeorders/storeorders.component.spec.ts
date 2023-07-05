import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreordersComponent } from './storeorders.component';

describe('StoreordersComponent', () => {
  let component: StoreordersComponent;
  let fixture: ComponentFixture<StoreordersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreordersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreordersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
