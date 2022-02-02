import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderSelectComponent } from './folder-select.component';

describe('FolderSelectComponent', () => {
  let component: FolderSelectComponent;
  let fixture: ComponentFixture<FolderSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FolderSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
