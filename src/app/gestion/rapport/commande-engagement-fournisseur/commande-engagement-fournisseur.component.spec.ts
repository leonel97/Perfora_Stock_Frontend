import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeEngagementFournisseurComponent } from './commande-engagement-fournisseur.component';

describe('CommandeEngagementFournisseurComponent', () => {
  let component: CommandeEngagementFournisseurComponent;
  let fixture: ComponentFixture<CommandeEngagementFournisseurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommandeEngagementFournisseurComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandeEngagementFournisseurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
