import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostMoveComponent } from './post-move.component';

describe('PostMoveComponent', () => {
  let component: PostMoveComponent;
  let fixture: ComponentFixture<PostMoveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostMoveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostMoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
