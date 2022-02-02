import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnerBorderComponent } from './spinner-border.component';

describe('SpinnerBorderComponent', () => {
  let component: SpinnerBorderComponent;
  let fixture: ComponentFixture<SpinnerBorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpinnerBorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinnerBorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
