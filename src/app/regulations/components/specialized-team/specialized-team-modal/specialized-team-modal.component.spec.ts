import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecializedTeamModalComponent } from './specialized-team-modal.component';

describe('SpecializedTeamModalComponent', () => {
  let component: SpecializedTeamModalComponent;
  let fixture: ComponentFixture<SpecializedTeamModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecializedTeamModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecializedTeamModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
