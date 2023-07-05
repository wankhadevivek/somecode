import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinloginComponent } from './spinlogin.component';

describe('SpinloginComponent', () => {
  let component: SpinloginComponent;
  let fixture: ComponentFixture<SpinloginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpinloginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
