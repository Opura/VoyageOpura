import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, concat, last, map, Observable, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Voyage } from '../models/voyage.model';
import { Review } from '../models/review.model';
import { VoyagesResponse } from '../models/voyagesResponse.model';

@Injectable({
  providedIn: 'root',
})
export class VoyagesServices {

  // URL de base de l'API
  // https://voyages-a7sf.onrender.com

  BASE_URL = environment.apiUrl;
  http = inject(HttpClient);

  getVoyagesPromoted(): Observable<Voyage[]> {
    return this.http.get<Voyage[] | { data: Voyage[] }>(`${this.BASE_URL}/voyages/featured`).pipe(
      map((response) => Array.isArray(response) ? response : response.data),
      catchError((error) => {
        console.error('Error fetching promoted voyages:', error);
        return throwError(() => error);
      })
    );
  }

  getVoyages(page: number = 1): Observable<VoyagesResponse> {
    return this.http.get<VoyagesResponse | { data: Voyage[]; meta: VoyagesResponse['meta'] }>(
      `${this.BASE_URL}/voyages?page=${page}`).pipe(
      map((response) => ('data' in response && 'meta' in response
        ? { data: response.data, meta: response.meta }
        : response
      )),
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
        allVoyages = allVoyages.concat(voyages1.data);
        return allVoyages;
      }),
      catchError((error) => {
        console.error('Error fetching voyages page 1:', error);
        return throwError(() => error);
      })
    );

    const fetchPage2 = this.getVoyages(2).pipe(
      map(voyages2 => {
        allVoyages = allVoyages.concat(voyages2.data);
        return allVoyages;
      }),
      catchError((error) => {
        console.error('Error fetching voyages page 2:', error);
        return throwError(() => error);
      })
    );

    const fetchPage3 = this.getVoyages(3).pipe(
      map(voyages3 => {
        allVoyages = allVoyages.concat(voyages3.data);
        return allVoyages;
      }),
      catchError((error) => {
        console.error('Error fetching voyages page 3:', error);
        return throwError(() => error);
      })
    );

    const fetchPage4 = this.getVoyages(4).pipe(
      map(voyages4 => {
        allVoyages = allVoyages.concat(voyages4.data);
        return allVoyages;
      }),
      catchError((error) => {
        console.error('Error fetching voyages page 4:', error);
        return throwError(() => error);
      })
    ); 

    const fetchPage5 = this.getVoyages(5).pipe(
      map(voyages5 => {
        allVoyages = allVoyages.concat(voyages5.data);
        return allVoyages;
      }),
      catchError((error) => {
        console.error('Error fetching voyages page 5:', error);
        return throwError(() => error);
      })
    );

    return concat(fetchPage1, fetchPage2, fetchPage3, fetchPage4, fetchPage5).pipe(
      last(),
      map(() => allVoyages)
    );
  }

  getVoyageById(id: string): Observable<Voyage> {
    return this.http.get<Voyage | { data: Voyage }>(`${this.BASE_URL}/voyages/${id}`).pipe(
      map((response) => ('data' in response ? response.data : response)),
      catchError((error) => {
        console.error('Error fetching voyage detail:', error);
        return throwError(() => error);
      })
    );
  }

  getVoyageCategories(): Observable<Voyage['category'][]> {
    return this.http.get<{ data: Voyage['category'][] }>(`${this.BASE_URL}/voyages/categories`).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.error('Error fetching voyage categories:', error);
        return throwError(() => error);
      })
    );
  }
}
