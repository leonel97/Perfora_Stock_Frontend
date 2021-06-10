import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonTravailComponent } from './bon-travail.component';

describe('BonTravailComponent', () => {
  let component: BonTravailComponent;
  let fixture: ComponentFixture<BonTravailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BonTravailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BonTravailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
