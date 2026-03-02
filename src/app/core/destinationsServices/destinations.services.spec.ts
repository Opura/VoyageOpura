import { TestBed } from '@angular/core/testing';

import { DestinationsServices } from './destinations.services';

describe('DestinationsServices', () => {
  let service: DestinationsServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DestinationsServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
