import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateStatusComponent } from './certificate-status.component';

describe('CertificateStatusComponent', () => {
  let component: CertificateStatusComponent;
  let fixture: ComponentFixture<CertificateStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificateStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificateStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
