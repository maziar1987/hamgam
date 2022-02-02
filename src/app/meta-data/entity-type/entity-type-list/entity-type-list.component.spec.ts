import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityTypeListComponent } from './entity-type-list.component';

describe('EntityTypeListComponent', () => {
  let component: EntityTypeListComponent;
  let fixture: ComponentFixture<EntityTypeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityTypeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
