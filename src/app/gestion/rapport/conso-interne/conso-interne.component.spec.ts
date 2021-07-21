import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoInterneComponent } from './conso-interne.component';

describe('ConsoInterneComponent', () => {
  let component: ConsoInterneComponent;
  let fixture: ComponentFixture<ConsoInterneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsoInterneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsoInterneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
