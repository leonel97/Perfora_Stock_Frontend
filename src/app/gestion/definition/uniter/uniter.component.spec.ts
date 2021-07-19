import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniterComponent } from './uniter.component';

describe('UniterComponent', () => {
  let component: UniterComponent;
  let fixture: ComponentFixture<UniterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UniterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UniterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
