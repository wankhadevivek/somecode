import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookDeclineComponent } from './book-decline.component';

describe('BookDeclineComponent', () => {
  let component: BookDeclineComponent;
  let fixture: ComponentFixture<BookDeclineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookDeclineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookDeclineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
