import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonServirComponent } from './bon-servir.component';

describe('BonServirComponent', () => {
  let component: BonServirComponent;
  let fixture: ComponentFixture<BonServirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BonServirComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BonServirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
