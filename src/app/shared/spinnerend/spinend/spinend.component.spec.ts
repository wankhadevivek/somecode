import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinendComponent } from './spinend.component';

describe('SpinendComponent', () => {
  let component: SpinendComponent;
  let fixture: ComponentFixture<SpinendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpinendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
