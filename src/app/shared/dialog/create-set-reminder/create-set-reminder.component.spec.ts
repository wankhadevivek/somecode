import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSetReminderComponent } from './create-set-reminder.component';

describe('CreateSetReminderComponent', () => {
  let component: CreateSetReminderComponent;
  let fixture: ComponentFixture<CreateSetReminderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSetReminderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSetReminderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
