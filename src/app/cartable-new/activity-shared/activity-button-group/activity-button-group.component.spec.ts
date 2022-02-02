import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityButtonGroupComponent } from './activity-button-group.component';

describe('ActivityButtonGroupComponent', () => {
  let component: ActivityButtonGroupComponent;
  let fixture: ComponentFixture<ActivityButtonGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityButtonGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityButtonGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
