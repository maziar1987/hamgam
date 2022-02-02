import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicySetNameListComponent } from './policy-set-name-list.component';

describe('PolicySetNameListComponent', () => {
  let component: PolicySetNameListComponent;
  let fixture: ComponentFixture<PolicySetNameListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicySetNameListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicySetNameListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
