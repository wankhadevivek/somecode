import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FestiveComponent } from './festive.component';

describe('FestiveComponent', () => {
  let component: FestiveComponent;
  let fixture: ComponentFixture<FestiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FestiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FestiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
