import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgunitChartBaseComponent } from './orgunit-chart-base.component';

describe('OrgunitChartBaseComponent', () => {
  let component: OrgunitChartBaseComponent;
  let fixture: ComponentFixture<OrgunitChartBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgunitChartBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgunitChartBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
