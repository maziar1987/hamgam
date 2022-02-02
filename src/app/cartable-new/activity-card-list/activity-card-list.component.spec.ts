import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityCardListComponent } from './activity-card-list.component';

describe('ActivityCardListComponent', () => {
  let component: ActivityCardListComponent;
  let fixture: ComponentFixture<ActivityCardListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityCardListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
