import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentreConsommationComponent } from './centre-consommation.component';

describe('CentreConsommationComponent', () => {
  let component: CentreConsommationComponent;
  let fixture: ComponentFixture<CentreConsommationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CentreConsommationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CentreConsommationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
