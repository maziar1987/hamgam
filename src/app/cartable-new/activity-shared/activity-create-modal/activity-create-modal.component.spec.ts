import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityCreateModalComponent } from './activity-create-modal.component';

describe('ActivityCreateModalComponent', () => {
  let component: ActivityCreateModalComponent;
  let fixture: ComponentFixture<ActivityCreateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityCreateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
