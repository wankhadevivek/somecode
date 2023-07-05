import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CusOnlineServicesComponent } from './cusonlineservices.component';

describe('LoginComponent', () => {
  let component: CusOnlineServicesComponent;
  let fixture: ComponentFixture<CusOnlineServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CusOnlineServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CusOnlineServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
