import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgUnitLayoutComponent } from './org-unit-layout.component';

describe('OrgUnitLayoutComponent', () => {
  let component: OrgUnitLayoutComponent;
  let fixture: ComponentFixture<OrgUnitLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgUnitLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgUnitLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
