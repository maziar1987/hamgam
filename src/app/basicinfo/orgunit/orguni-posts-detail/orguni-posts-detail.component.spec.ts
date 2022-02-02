import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrguniPostsDetailComponent } from './orguni-posts-detail.component';

describe('OrguniPostsDetailComponent', () => {
  let component: OrguniPostsDetailComponent;
  let fixture: ComponentFixture<OrguniPostsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrguniPostsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrguniPostsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
