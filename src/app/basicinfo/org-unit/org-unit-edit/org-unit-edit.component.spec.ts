import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgUnitEditComponent } from './org-unit-edit.component';

describe('OrgUnitEditComponent', () => {
  let component: OrgUnitEditComponent;
  let fixture: ComponentFixture<OrgUnitEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgUnitEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgUnitEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
