import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastJobcardHistoryComponent } from './last-jobcard-history.component';

describe('LastJobcardHistoryComponent', () => {
  let component: LastJobcardHistoryComponent;
  let fixture: ComponentFixture<LastJobcardHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastJobcardHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastJobcardHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
