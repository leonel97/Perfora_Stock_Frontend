import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntreeArticleComponent } from './entree-article.component';

describe('EntreeArticleComponent', () => {
  let component: EntreeArticleComponent;
  let fixture: ComponentFixture<EntreeArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntreeArticleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntreeArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
