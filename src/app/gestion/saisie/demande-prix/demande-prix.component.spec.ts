import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandePrixComponent } from './demande-prix.component';

describe('DemandePrixComponent', () => {
  let component: DemandePrixComponent;
  let fixture: ComponentFixture<DemandePrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemandePrixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandePrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
