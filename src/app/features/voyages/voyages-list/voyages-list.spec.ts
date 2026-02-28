import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoyagesList } from './voyages-list';

describe('VoyagesList', () => {
  let component: VoyagesList;
  let fixture: ComponentFixture<VoyagesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoyagesList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoyagesList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
