import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GaragefinderComponent } from './garagefinder.component';

describe('GaragefinderComponent', () => {
  let component: GaragefinderComponent;
  let fixture: ComponentFixture<GaragefinderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GaragefinderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GaragefinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
