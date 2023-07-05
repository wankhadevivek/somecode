import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CusOnlineRegisterComponent } from './cusonlineregister.component';

describe('LoginComponent', () => {
  let component: CusOnlineRegisterComponent;
  let fixture: ComponentFixture<CusOnlineRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CusOnlineRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CusOnlineRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
