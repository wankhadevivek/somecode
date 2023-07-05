import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CusOnlineBookComponent } from './cusonlinebook.component';

describe('LoginComponent', () => {
  let component: CusOnlineBookComponent;
  let fixture: ComponentFixture<CusOnlineBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CusOnlineBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CusOnlineBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
