import { TestBed } from '@angular/core/testing';

import { ReviewsServices } from './reviews-services';

describe('ReviewsServices', () => {
  let service: ReviewsServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReviewsServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
