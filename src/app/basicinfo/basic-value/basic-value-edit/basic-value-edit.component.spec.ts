import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicInfoEditComponent } from './basic-info-edit.components';

describe('BasicInfoEditComponent', () => {
  let component: BasicInfoEditComponent;
  let fixture: ComponentFixture<BasicInfoEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicInfoEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicInfoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
