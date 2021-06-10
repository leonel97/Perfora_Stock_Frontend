import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloturePeriodiqueComponent } from './cloture-periodique.component';

describe('CloturePeriodiqueComponent', () => {
  let component: CloturePeriodiqueComponent;
  let fixture: ComponentFixture<CloturePeriodiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloturePeriodiqueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloturePeriodiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
