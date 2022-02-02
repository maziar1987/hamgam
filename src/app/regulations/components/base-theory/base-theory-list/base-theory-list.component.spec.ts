import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseTheoryListComponent } from './base-theory-list.component';

describe('BaseTheoryListComponent', () => {
  let component: BaseTheoryListComponent;
  let fixture: ComponentFixture<BaseTheoryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseTheoryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseTheoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
