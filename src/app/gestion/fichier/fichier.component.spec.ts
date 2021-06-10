import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichierComponent } from './fichier.component';

describe('FichierComponent', () => {
  let component: FichierComponent;
  let fixture: ComponentFixture<FichierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FichierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FichierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
