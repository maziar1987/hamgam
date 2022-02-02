import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HitxOrgchartComponent } from './hitx-orgchart.component';

describe('HitxOrgchartComponent', () => {
  let component: HitxOrgchartComponent;
  let fixture: ComponentFixture<HitxOrgchartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HitxOrgchartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HitxOrgchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
