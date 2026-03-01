import { TestBed } from '@angular/core/testing';

import { VoyagesServices } from './voyages.services';

describe('VoyagesServices', () => {
  let service: VoyagesServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoyagesServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
