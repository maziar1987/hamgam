import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuManagementLayoutComponent } from './menu-management-layout.component';

describe('MenuManagementLayoutComponent', () => {
  let component: MenuManagementLayoutComponent;
  let fixture: ComponentFixture<MenuManagementLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuManagementLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuManagementLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
