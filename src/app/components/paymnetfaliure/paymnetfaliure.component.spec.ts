import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymnetfaliureComponent } from './paymnetfaliure.component';

describe('PaymnetfaliureComponent', () => {
  let component: PaymnetfaliureComponent;
  let fixture: ComponentFixture<PaymnetfaliureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymnetfaliureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymnetfaliureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
