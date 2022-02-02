import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegulationsCertificateCreateComponent } from './regulations-certificate-create.component';

describe('RegulationsCertificateCreateComponent', () => {
  let component: RegulationsCertificateCreateComponent;
  let fixture: ComponentFixture<RegulationsCertificateCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegulationsCertificateCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegulationsCertificateCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
