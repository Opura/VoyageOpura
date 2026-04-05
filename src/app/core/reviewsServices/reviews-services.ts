import { inject, Injectable } from '@angular/core';

import { Review } from '../models/review.model';

import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ReviewsResponse } from '../models/reviewsResponse.model';

type CreateReviewPayload = Pick<Review, 'authorName' | 'rating' | 'title' | 'comment'>;


@Injectable({
  providedIn: 'root',
})
export class ReviewsServices {

  // URL de base de l'API
  // https://voyages-a7sf.onrender.com

  BASE_URL = environment.apiUrl;
  http = inject(HttpClient);
  
  getVoyageReviews(id: string): Observable<ReviewsResponse> {
    return this.http.get<ReviewsResponse | { data: ReviewsResponse }>(`${this.BASE_URL}/voyages/${id}/reviews`).pipe(
      map((response) => ('data' in response ? response.data : response)),
      catchError((error) => {
        console.error('Error fetching voyage reviews:', error);
        return throwError(() => error);
      })
    );
  }

  createVoyageReview(id: string, payload: CreateReviewPayload): Observable<Review> {
    return this.http.post<Review | { data: Review }>(`${this.BASE_URL}/voyages/${id}/reviews`, payload).pipe(
      map((response) => ('data' in response ? response.data : response)),
      catchError((error) => {
        console.error('Error creating voyage review:', error);
        return throwError(() => error);
      })
    );
  }
}
