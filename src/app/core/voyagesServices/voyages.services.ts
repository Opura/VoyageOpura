import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, switchMap, tap, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Voyage } from '../models/voyage.model';
import { Destination } from '../models/destination.model';
import { Review } from '../models/review.model';
import { ReviewsResponse } from '../models/reviewsResponse.model';

interface ApiResponseVoyage {
  data: Voyage[];
}

interface ApiResponseVoyageById {
  data: Voyage;
}

interface ApiResponseDestination {
  data: Destination[];
}

interface ApiResponseReview {
  data: Review;
}

interface CreateReview {
  authorName: string;
  rating: number;
  title: string;
  comment: string;
}

@Injectable({
  providedIn: 'root',
})
export class VoyagesServices {

  // URL de base de l'API
  // https://voyages-a7sf.onrender.com

  BASE_URL = environment.apiUrl;
  http = inject(HttpClient);

  getVoyagesPromoted(): Observable<Voyage[]> {
    return this.http.get<ApiResponseVoyage>(`${this.BASE_URL}/voyages/featured`).pipe(
      map(response => response.data.filter(voyage => voyage.isPromoted === true)),
      catchError((error) => {
        console.error('Error fetching promoted voyages:', error);
        return throwError(() => error);
      })
    );
  }

  // oldGetVoyagesPromoted(): Observable<Voyage[]> {
  //   return this.http.get(`${this.BASE_URL}/voyages/featured`)
  //     .pipe(
  //       map((response) => response.filter((voyage: Voyage) => voyage.isPromoted === true)),
  //       catchError((error) => {
  //         console.error('Error fetching promoted voyages:', error);
  //         return throwError(() => error);
  //       })
  //     );
  // }

  getVoyages(page: number = 1): Observable<Voyage[]> {
    return this.http.get<ApiResponseVoyage>(`${this.BASE_URL}/voyages?page=${page}`).pipe(
      map(response => response.data),
      catchError((error) => {
        console.error('Error fetching voyages:', error);
        return throwError(() => error);
      })
    );
  }

  getAllVoyages(): Observable<Voyage[]> {
    const totalPages = 5;
    let allVoyages: Voyage[] = [];

    const fetchPage = (page: number): Observable<Voyage[]> => {
      return this.getVoyages(page).pipe(
        map((voyages) => {
          allVoyages = allVoyages.concat(voyages);
          return allVoyages;
        }),
        catchError((error) => {
          console.error('Erreur lors de la récupération des voyages:', error);
          return throwError(() => error);
        })
      );
    };

    let result$ = fetchPage(1);

    for (let page = 2; page <= totalPages; page++) {
      result$ = result$.pipe(
        switchMap(() => fetchPage(page))
      );
    }

    return result$;
  }

  getAllDestinations(): Observable<Destination[]> {
    return this.http.get<ApiResponseDestination>(`${this.BASE_URL}/destinations`).pipe(
      map(response => response.data),
      catchError((error) => {
        console.error('Error fetching destinations:', error);
        return throwError(() => error);
      })
    );
  }

  getVoyageById(id: string): Observable<Voyage> {
    return this.http.get<ApiResponseVoyageById>(`${this.BASE_URL}/voyages/${id}`).pipe(
      map(response => response.data),
      tap((data) => console.log(data)),
      catchError((error) => {
        console.error('Error fetching voyage detail:', error);
        return throwError(() => error);
      })
    );
  }

  getVoyageReviews(id: string): Observable<ReviewsResponse> {
    return this.http.get<ReviewsResponse>(`${this.BASE_URL}/voyages/${id}/reviews`).pipe(
      catchError((error) => {
        console.error('Error fetching voyage reviews:', error);
        return throwError(() => error);
      })
    );
  }

  createVoyageReview(id: string, payload: CreateReview): Observable<Review> {
    return this.http.post<ApiResponseReview | Review>(`${this.BASE_URL}/voyages/${id}/reviews`, payload).pipe(
      map((response) => {
        if ('data' in response) {
          return response.data;
        }
        return response;
      }),
      catchError((error) => {
        console.error('Error creating voyage review:', error);
        return throwError(() => error);
      })
    );
  }
}
