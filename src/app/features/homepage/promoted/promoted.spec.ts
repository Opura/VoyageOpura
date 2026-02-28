import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Promoted } from './promoted';

describe('Promoted', () => {
  let component: Promoted;
  let fixture: ComponentFixture<Promoted>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Promoted]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Promoted);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
