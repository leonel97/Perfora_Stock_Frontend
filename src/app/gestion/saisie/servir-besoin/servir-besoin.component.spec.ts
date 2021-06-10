import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServirBesoinComponent } from './servir-besoin.component';

describe('ServirBesoinComponent', () => {
  let component: ServirBesoinComponent;
  let fixture: ComponentFixture<ServirBesoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServirBesoinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServirBesoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
