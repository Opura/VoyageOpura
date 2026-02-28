import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoyageDetail } from './voyage-detail';

describe('VoyageDetail', () => {
  let component: VoyageDetail;
  let fixture: ComponentFixture<VoyageDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoyageDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoyageDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
