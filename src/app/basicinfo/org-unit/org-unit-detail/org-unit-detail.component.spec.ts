import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgUnitDetailComponent } from './org-unit-detail.component';

describe('OrgUnitDetailComponent', () => {
  let component: OrgUnitDetailComponent;
  let fixture: ComponentFixture<OrgUnitDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgUnitDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgUnitDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
