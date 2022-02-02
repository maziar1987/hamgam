import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RfpCreateComponent } from './rfp-create.component';

describe('RfpCreateComponent', () => {
  let component: RfpCreateComponent;
  let fixture: ComponentFixture<RfpCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RfpCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfpCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
