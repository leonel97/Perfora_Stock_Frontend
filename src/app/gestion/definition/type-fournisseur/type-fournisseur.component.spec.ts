import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeFournisseurComponent } from './type-fournisseur.component';

describe('TypeFournisseurComponent', () => {
  let component: TypeFournisseurComponent;
  let fixture: ComponentFixture<TypeFournisseurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeFournisseurComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeFournisseurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
