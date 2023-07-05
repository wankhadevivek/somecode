import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CusprofileComponent } from './cusprofile.component';

describe('CusprofileComponent', () => {
  let component: CusprofileComponent;
  let fixture: ComponentFixture<CusprofileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CusprofileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CusprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
