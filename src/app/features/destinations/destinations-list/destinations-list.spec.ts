import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinationsList } from './destinations-list';

describe('DestinationsList', () => {
  let component: DestinationsList;
  let fixture: ComponentFixture<DestinationsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DestinationsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DestinationsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
