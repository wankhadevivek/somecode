import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectOptionOpenComponent } from './select-option-open.component';

describe('SelectOptionOpenComponent', () => {
  let component: SelectOptionOpenComponent;
  let fixture: ComponentFixture<SelectOptionOpenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectOptionOpenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectOptionOpenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
