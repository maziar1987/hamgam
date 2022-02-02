import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicInfoListComponent } from './basic-info-list.components';

describe('BasicInfoListComponent', () => {
  let component: BasicInfoListComponent;
  let fixture: ComponentFixture<BasicInfoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicInfoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicInfoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
