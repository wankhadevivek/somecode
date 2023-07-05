import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnduserfailComponent } from './enduserfail.component';

describe('EnduserfailComponent', () => {
  let component: EnduserfailComponent;
  let fixture: ComponentFixture<EnduserfailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnduserfailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnduserfailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
