import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Famous } from './famous';

describe('Famous', () => {
  let component: Famous;
  let fixture: ComponentFixture<Famous>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Famous]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Famous);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
