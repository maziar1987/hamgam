import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgunitComponent } from './orgunit.component';

describe('OrgunitComponent', () => {
  let component: OrgunitComponent;
  let fixture: ComponentFixture<OrgunitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgunitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgunitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
