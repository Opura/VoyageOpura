import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, forkJoin, map, Observable, of, switchMap, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Voyage } from '../models/voyage.model';
import { VoyagesResponse } from '../models/voyagesResponse.model';

type VoyageDetailResponse = { data: Voyage };

@Injectable({
  providedIn: 'root',
})
export class VoyagesServices {

  // URL de base de l'API
  // https://voyages-a7sf.onrender.com

  BASE_URL = environment.apiUrl;
  http = inject(HttpClient);

  getVoyagesPage(page: number = 1): Observable<VoyagesResponse> {
    return this.http.get<VoyagesResponse>(`${this.BASE_URL}/voyages?page=${page}`).pipe(
      map((response) => ({
        data: response.data ?? [],
        meta: response.meta,
      })),
      catchError((error) => {
        console.error(`Error fetching voyages page ${page}:`, error);
        return throwError(() => error);
      })
    );
  }

  getVoyages(page: number = 1): Observable<Voyage[]> {
    return this.getVoyagesPage(page).pipe(
      map((response) => response.data ?? []),
      catchError((error) => {
        console.error(`Error fetching voyages page ${page}:`, error);
        return throwError(() => error);
      })
    );
  }

  getVoyagesFeatured(): Observable<Voyage[]> {
    return this.http.get<unknown>(`${this.BASE_URL}/voyages/featured`).pipe(
      map((response) => this.extractArrayData<Voyage>(response)),
      catchError((error) => {
        console.error('Error fetching featured voyages:', error);
        return throwError(() => error);
      })
    );
  }

  getVoyageCategories(): Observable<string[]> {
    return this.http.get<unknown>(`${this.BASE_URL}/voyages/categories`).pipe(
      map((response) =>
        this.extractArrayData<string>(response).filter((category): category is string => typeof category === 'string')
      ),
      catchError((error) => {
        console.error('Error fetching voyage categories:', error);
        return throwError(() => error);
      })
    );
  }

  getAllVoyages(): Observable<Voyage[]> {
    return this.getVoyagesPage(1).pipe(
      switchMap((firstPage) => {
        const firstPageData = firstPage.data ?? [];
        const totalPages = Math.max(firstPage.meta?.totalPages ?? 1, 1);

        if (totalPages <= 1) {
          return of(firstPageData);
        }

        const remainingRequests = Array.from(
          { length: totalPages - 1 },
          (_, index) => this.getVoyages(index + 2)
        );

        return forkJoin(remainingRequests).pipe(
          map((remainingPages) => [firstPageData, ...remainingPages].flat())
        );
      }),
      catchError((error) => {
        console.error('Error fetching all voyages:', error);
        return throwError(() => error);
      })
    );
  }

  getVoyagesPromoted(): Observable<Voyage[]> {
    return this.getVoyagesFeatured().pipe(
      map((voyages) => voyages.filter((voyage) => voyage.isPromoted === true)),
      catchError((error) => {
        console.error('Error fetching promoted voyages:', error);
        return throwError(() => error);
      })
    );
  }

  getVoyageById(id: string): Observable<Voyage> {
    return this.http.get<VoyageDetailResponse>(`${this.BASE_URL}/voyages/${id}`).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.error('Error fetching voyage detail:', error);
        return throwError(() => error);
      })
    );
  }

  private extractArrayData<T>(response: unknown): T[] {
    if (Array.isArray(response)) {
      return response as T[];
    }

    if (this.isRecord(response)) {
      const data = response['data'];
      if (Array.isArray(data)) {
        return data as T[];
      }
    }

    return [];
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }
}
