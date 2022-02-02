import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityDefaultTextDropdownComponent } from './activity-default-text-dropdown.component';

describe('ActivityDefaultTextDropdownComponent', () => {
  let component: ActivityDefaultTextDropdownComponent;
  let fixture: ComponentFixture<ActivityDefaultTextDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityDefaultTextDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityDefaultTextDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
