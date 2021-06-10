import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepotOffreFactureProformatComponent } from './depot-offre-facture-proformat.component';

describe('DepotOffreFactureProformatComponent', () => {
  let component: DepotOffreFactureProformatComponent;
  let fixture: ComponentFixture<DepotOffreFactureProformatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepotOffreFactureProformatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepotOffreFactureProformatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
