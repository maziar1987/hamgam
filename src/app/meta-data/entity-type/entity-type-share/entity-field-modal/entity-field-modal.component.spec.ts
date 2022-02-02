import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityFieldModalComponent } from './entity-field-modal.component';

describe('EntityFieldModalComponent', () => {
  let component: EntityFieldModalComponent;
  let fixture: ComponentFixture<EntityFieldModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityFieldModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityFieldModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
