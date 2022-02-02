import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicInfoDetailComponent } from './basic-info-detail.components';

describe('BasicInfoDetailComponent', () => {
  let component: BasicInfoDetailComponent;
  let fixture: ComponentFixture<BasicInfoDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicInfoDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicInfoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
