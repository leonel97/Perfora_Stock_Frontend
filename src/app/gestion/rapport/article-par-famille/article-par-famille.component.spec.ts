import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleParFamilleComponent } from './article-par-famille.component';

describe('ArticleParFamilleComponent', () => {
  let component: ArticleParFamilleComponent;
  let fixture: ComponentFixture<ArticleParFamilleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticleParFamilleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleParFamilleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
