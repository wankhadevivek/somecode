import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndusersuccessComponent } from './endusersuccess.component';

describe('EndusersuccessComponent', () => {
  let component: EndusersuccessComponent;
  let fixture: ComponentFixture<EndusersuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndusersuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndusersuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
