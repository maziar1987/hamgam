import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityHistoryListComponent } from './activity-history-list.component';

describe('ActivityHistoryListComponent', () => {
  let component: ActivityHistoryListComponent;
  let fixture: ComponentFixture<ActivityHistoryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityHistoryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityHistoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
