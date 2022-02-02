import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetSpecificationEditComponent } from './target-specification-edit.component';

describe('TargetSpecificationEditComponent', () => {
  let component: TargetSpecificationEditComponent;
  let fixture: ComponentFixture<TargetSpecificationEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TargetSpecificationEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetSpecificationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
