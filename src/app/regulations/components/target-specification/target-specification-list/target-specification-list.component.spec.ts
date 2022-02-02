import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetSpecificationListComponent } from './target-specification-list.component';

describe('TargetSpecificationListComponent', () => {
  let component: TargetSpecificationListComponent;
  let fixture: ComponentFixture<TargetSpecificationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TargetSpecificationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetSpecificationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
