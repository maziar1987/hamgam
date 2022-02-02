import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditBaseTheoryComponent } from './add-edit-base-theory.component';

describe('AddEditBaseTheoryComponent', () => {
  let component: AddEditBaseTheoryComponent;
  let fixture: ComponentFixture<AddEditBaseTheoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditBaseTheoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditBaseTheoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
