import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalMemberModalComponent } from './external-member-modal.component';

describe('ExternalMemberModalComponent', () => {
  let component: ExternalMemberModalComponent;
  let fixture: ComponentFixture<ExternalMemberModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalMemberModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalMemberModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
