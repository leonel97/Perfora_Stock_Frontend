import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeCentreConsommationComponent } from './type-centre-consommation.component';

describe('TypeCentreConsommationComponent', () => {
  let component: TypeCentreConsommationComponent;
  let fixture: ComponentFixture<TypeCentreConsommationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeCentreConsommationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeCentreConsommationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
