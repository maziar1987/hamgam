import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgunitChartComponent } from './orgunit-chart.component';

describe('OrgunitChartComponent', () => {
  let component: OrgunitChartComponent;
  let fixture: ComponentFixture<OrgunitChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgunitChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgunitChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
