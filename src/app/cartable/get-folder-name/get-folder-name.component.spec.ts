import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetFolderNameComponent } from './get-folder-name.component';

describe('GetFolderNameComponent', () => {
  let component: GetFolderNameComponent;
  let fixture: ComponentFixture<GetFolderNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetFolderNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetFolderNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
