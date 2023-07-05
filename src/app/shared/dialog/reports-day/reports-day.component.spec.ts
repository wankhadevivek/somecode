import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsDayComponent } from './reports-day.component';

describe('ReportsDayComponent', () => {
  let component: ReportsDayComponent;
  let fixture: ComponentFixture<ReportsDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsDayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
