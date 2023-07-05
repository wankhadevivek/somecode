import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDataFileComponent } from './admin-data-file.component';

describe('AdminDataFileComponent', () => {
  let component: AdminDataFileComponent;
  let fixture: ComponentFixture<AdminDataFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDataFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDataFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
