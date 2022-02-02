import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartVersionComponent } from './chart-version.component';

describe('ChartVersionComponent', () => {
  let component: ChartVersionComponent;
  let fixture: ComponentFixture<ChartVersionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartVersionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
