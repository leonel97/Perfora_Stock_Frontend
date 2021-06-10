import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CauseAnnomalieComponent } from './cause-annomalie.component';

describe('CauseAnnomalieComponent', () => {
  let component: CauseAnnomalieComponent;
  let fixture: ComponentFixture<CauseAnnomalieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CauseAnnomalieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CauseAnnomalieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
