import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeEngagementArticleComponent } from './commande-engagement-article.component';

describe('CommandeEngagementArticleComponent', () => {
  let component: CommandeEngagementArticleComponent;
  let fixture: ComponentFixture<CommandeEngagementArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommandeEngagementArticleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandeEngagementArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
