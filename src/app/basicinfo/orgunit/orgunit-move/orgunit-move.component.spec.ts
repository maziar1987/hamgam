import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgunitMoveComponent } from './orgunit-move.component';

describe('OrgunitMoveComponent', () => {
  let component: OrgunitMoveComponent;
  let fixture: ComponentFixture<OrgunitMoveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgunitMoveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgunitMoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
