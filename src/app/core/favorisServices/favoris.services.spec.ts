import { TestBed } from '@angular/core/testing';

import { FavorisServices } from './favoris.services';

describe('FavorisServices', () => {
  let service: FavorisServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavorisServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
