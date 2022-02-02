import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegulationsListComponent } from './regulations-list.component';

describe('RegulationsListComponent', () => {
  let component: RegulationsListComponent;
  let fixture: ComponentFixture<RegulationsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegulationsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegulationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
