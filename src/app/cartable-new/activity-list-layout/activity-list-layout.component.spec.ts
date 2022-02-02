import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityListLayoutComponent } from './activity-list-layout.component';

describe('ActivityListLayoutComponent', () => {
  let component: ActivityListLayoutComponent;
  let fixture: ComponentFixture<ActivityListLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityListLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityListLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
