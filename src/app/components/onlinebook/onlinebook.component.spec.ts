import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlinebookComponent } from './onlinebook.component';

describe('OnlinebookComponent', () => {
  let component: OnlinebookComponent;
  let fixture: ComponentFixture<OnlinebookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlinebookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlinebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
