import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Voyage } from '../models/voyage.model';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root',
})
export class VoyagesServices {

  // URL de base de l'API
  // https://voyages-a7sf.onrender.com

  BASE_URL = environment.apiUrl;
  http = inject(HttpClient);

  getVoyagesPromoted(): Observable<Voyage[]> {
    return this.http.get<Voyage[]>(`${this.BASE_URL}/voyages`).pipe(
      map(voyages => voyages.filter(voyage => voyage.isPromoted === true)),
      catchError((error) => {
        console.error('Error fetching promoted voyages:', error);
        return throwError(() => error);
      })
    );
  }

  getVoyages(page: number = 1): Observable<Voyage[]> {
    return this.http.get<Voyage[]>(`${this.BASE_URL}/voyages?page=${page}`).pipe(
      catchError((error) => {
        console.error(`Error fetching voyages page ${page}:`, error);
        return throwError(() => error);
      })
    );
  }

  getAllVoyages() {
    let allVoyages: Voyage[] = [];

    const fetchPage1 = this.getVoyages(1).pipe(
      map(voyages1 => {
        allVoyages = allVoyages.concat(voyages1);
        return allVoyages;
      }),
      catchError((error) => {
        console.error('Error fetching voyages page 1:', error);
        return throwError(() => error);
      })
    );

    const fetchPage2 = this.getVoyages(2).pipe(
      map(voyages2 => {
        allVoyages = allVoyages.concat(voyages2);
        return allVoyages;
      }),
      catchError((error) => {
        console.error('Error fetching voyages page 2:', error);
        return throwError(() => error);
      })
    );

    const fetchPage3 = this.getVoyages(3).pipe(
      map(voyages3 => {
        allVoyages = allVoyages.concat(voyages3);
        return allVoyages;
      }),
      catchError((error) => {
        console.error('Error fetching voyages page 3:', error);
        return throwError(() => error);
      })
    );

    const fetchPage4 = this.getVoyages(4).pipe(
      map(voyages4 => {
        allVoyages = allVoyages.concat(voyages4);
        return allVoyages;
      }),
      catchError((error) => {
        console.error('Error fetching voyages page 4:', error);
        return throwError(() => error);
      })
    ); 

    const fetchPage5 = this.getVoyages(5).pipe(
      map(voyages5 => {
        allVoyages = allVoyages.concat(voyages5);
        return allVoyages;
      }),
      catchError((error) => {
        console.error('Error fetching voyages page 5:', error);
        return throwError(() => error);
      })
    );

    return of(allVoyages);
  }

  getVoyageById(id: string): Observable<Voyage> {
    return this.http.get<Voyage>(`${this.BASE_URL}/voyages/${id}`).pipe(
      catchError((error) => {
        console.error('Error fetching voyage detail:', error);
        return throwError(() => error);
      })
    );
  }

  getVoyageReviews(id: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.BASE_URL}/voyages/${id}/reviews`).pipe(
      catchError((error) => {
        console.error('Error fetching voyage reviews:', error);
        return throwError(() => error);
      })
    );
  }

  createVoyageReview(id: string, payload: Review): Observable<Review> {
    return this.http.post<Review>(`${this.BASE_URL}/voyages/${id}/reviews`, payload).pipe(
      catchError((error) => {
        console.error('Error creating voyage review:', error);
        return throwError(() => error);
      })
    );
  }
}
