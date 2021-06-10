import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeBesoinComponent } from './demande-besoin.component';

describe('DemandeBesoinComponent', () => {
  let component: DemandeBesoinComponent;
  let fixture: ComponentFixture<DemandeBesoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemandeBesoinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandeBesoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
