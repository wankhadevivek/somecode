import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobcardDetailComponent } from './jobcard-detail.component';

describe('JobcardDetailComponent', () => {
  let component: JobcardDetailComponent;
  let fixture: ComponentFixture<JobcardDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobcardDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobcardDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
