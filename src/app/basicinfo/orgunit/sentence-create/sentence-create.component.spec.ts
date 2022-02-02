import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SentenceCreateComponent } from './sentence-create.component';

describe('SentenceCreateComponent', () => {
  let component: SentenceCreateComponent;
  let fixture: ComponentFixture<SentenceCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SentenceCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SentenceCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
