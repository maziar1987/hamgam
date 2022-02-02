import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgUnitTreeComponent } from './org-unit-tree.component';

describe('OrgUnitTreeComponent', () => {
  let component: OrgUnitTreeComponent;
  let fixture: ComponentFixture<OrgUnitTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgUnitTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgUnitTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
