import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Review } from '../models/review.model';
import { ReviewsResponse } from '../models/reviewsResponse.model';

@Injectable({
    providedIn: 'root',
})
export class ReviewsServices {
    BASE_URL = environment.apiUrl;
    http = inject(HttpClient);

    getVoyageReviews(id: string): Observable<ReviewsResponse> {
        return this.http.get<ReviewsResponse>(`${this.BASE_URL}/voyages/${id}/reviews`).pipe(
        catchError((error) => {
            console.error('Error fetching voyage reviews:', error);
            return throwError(() => error);
        })
        );
    }

    createVoyageReview(
        id: string,
        payload: Pick<Review, 'authorName' | 'rating' | 'title' | 'comment'>
    ): Observable<Review> {
        return this.http.post<Review>(`${this.BASE_URL}/voyages/${id}/reviews`, payload).pipe(
        catchError((error) => {
            console.error('Error creating voyage review:', error);
            return throwError(() => error);
        })
        );
    }
}
