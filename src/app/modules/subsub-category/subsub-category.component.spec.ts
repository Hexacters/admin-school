import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsubCategoryComponent } from './subsub-category.component';

describe('SubsubCategoryComponent', () => {
  let component: SubsubCategoryComponent;
  let fixture: ComponentFixture<SubsubCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubsubCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubsubCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
