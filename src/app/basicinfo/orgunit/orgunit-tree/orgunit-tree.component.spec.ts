import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgunitTreeComponent } from './orgunit-tree.component';

describe('OrgunitTreeComponent', () => {
  let component: OrgunitTreeComponent;
  let fixture: ComponentFixture<OrgunitTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgunitTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgunitTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
