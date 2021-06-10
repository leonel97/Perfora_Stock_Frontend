import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LettreCommandeComponent } from './lettre-commande.component';

describe('LettreCommandeComponent', () => {
  let component: LettreCommandeComponent;
  let fixture: ComponentFixture<LettreCommandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LettreCommandeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LettreCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
