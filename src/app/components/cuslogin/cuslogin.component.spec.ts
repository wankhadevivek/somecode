import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CusloginComponent } from './cuslogin.component';

describe('LoginComponent', () => {
  let component: CusloginComponent;
  let fixture: ComponentFixture<CusloginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CusloginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CusloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
