import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PilotappComponent } from './pilotapp.component';

describe('PilotappComponent', () => {
  let component: PilotappComponent;
  let fixture: ComponentFixture<PilotappComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PilotappComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PilotappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
