import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidelayoutComponent } from './sidelayout.component';

describe('SidelayoutComponent', () => {
  let component: SidelayoutComponent;
  let fixture: ComponentFixture<SidelayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidelayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidelayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
