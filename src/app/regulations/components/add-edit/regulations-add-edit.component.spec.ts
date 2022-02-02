import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegulationsAddEditComponent } from './regulations-add-edit.component';

describe('RegulationsAddEditComponent', () => {
  let component: RegulationsAddEditComponent;
  let fixture: ComponentFixture<RegulationsAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegulationsAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegulationsAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
