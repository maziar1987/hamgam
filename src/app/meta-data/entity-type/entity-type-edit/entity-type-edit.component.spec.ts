import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityTypeEditComponent } from './entity-type-edit.component';

describe('EntityTypeEditComponent', () => {
  let component: EntityTypeEditComponent;
  let fixture: ComponentFixture<EntityTypeEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityTypeEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityTypeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
