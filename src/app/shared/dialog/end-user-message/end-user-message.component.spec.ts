import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndUserMessageComponent } from './end-user-message.component';

describe('EndUserMessageComponent', () => {
  let component: EndUserMessageComponent;
  let fixture: ComponentFixture<EndUserMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndUserMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndUserMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
