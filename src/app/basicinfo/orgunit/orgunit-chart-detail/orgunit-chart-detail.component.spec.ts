import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgunitChartDetailComponent } from './orgunit-chart-detail.component';

describe('OrgunitChartDetailComponent', () => {
  let component: OrgunitChartDetailComponent;
  let fixture: ComponentFixture<OrgunitChartDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgunitChartDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgunitChartDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
