import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllowNotificationComponent } from './allow-notification.component';

describe('AllowNotificationComponent', () => {
  let component: AllowNotificationComponent;
  let fixture: ComponentFixture<AllowNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllowNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllowNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
