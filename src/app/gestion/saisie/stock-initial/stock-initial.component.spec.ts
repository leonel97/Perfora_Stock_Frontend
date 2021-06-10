import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockInitialComponent } from './stock-initial.component';

describe('StockInitialComponent', () => {
  let component: StockInitialComponent;
  let fixture: ComponentFixture<StockInitialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockInitialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockInitialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
