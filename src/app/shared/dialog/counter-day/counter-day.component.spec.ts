import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterDayComponent } from './counter-day.component';

describe('CounterDayComponent', () => {
  let component: CounterDayComponent;
  let fixture: ComponentFixture<CounterDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CounterDayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
