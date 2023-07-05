import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RememAccdetailsComponent } from './remem-accdetails.component';

describe('RememAccdetailsComponent', () => {
  let component: RememAccdetailsComponent;
  let fixture: ComponentFixture<RememAccdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RememAccdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RememAccdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
