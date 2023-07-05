import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndUserLoginComponent } from './end-user-login.component';

describe('EndUserLoginComponent', () => {
  let component: EndUserLoginComponent;
  let fixture: ComponentFixture<EndUserLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndUserLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndUserLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
