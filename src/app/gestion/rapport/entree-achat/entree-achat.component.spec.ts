import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntreeAchatComponent } from './entree-achat.component';

describe('EntreeAchatComponent', () => {
  let component: EntreeAchatComponent;
  let fixture: ComponentFixture<EntreeAchatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntreeAchatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntreeAchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
