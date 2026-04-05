import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Destination } from '../models/destination.model';

type DestinationsResponse = { data: Destination[] };
type DestinationResponse = { data: Destination };

export interface DestinationFilters {
  continent?: string;
  climate?: string;
  q?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DestinationsServices {

  // URL de base de l'API
  // https://voyages-a7sf.onrender.com
  
  BASE_URL = environment.apiUrl;
  http = inject(HttpClient);

  getDestinations(filters: DestinationFilters = {}): Observable<Destination[]> {
    let params = new HttpParams();

    if (filters.continent) {
      params = params.set('continent', filters.continent);
    }
    if (filters.climate) {
      params = params.set('climate', filters.climate);
    }
    if (filters.q) {
      params = params.set('q', filters.q);
    }

    return this.http.get<DestinationsResponse>(`${this.BASE_URL}/destinations`, { params }).pipe(
      map((response) => response.data ?? []),
      catchError((error) => {
        console.error('Error fetching destinations:', error);
        return throwError(() => error);
      })
    );
  }

  getDestinationContinents(): Observable<string[]> {
    return this.http.get<unknown>(`${this.BASE_URL}/destinations/continents`).pipe(
      map((response) =>
        this.extractArrayData<string>(response).filter((continent): continent is string => typeof continent === 'string')
      ),
      catchError((error) => {
        console.error('Error fetching destination continents:', error);
        return throwError(() => error);
      })
    );
  }

  getAllDestinations(): Observable<Destination[]> {
    return this.getDestinations().pipe(
      map(destinations => destinations || []),
      catchError((error) => {
        console.error('Error fetching all destinations:', error);
        return throwError(() => error);
      })
    );
  }

  getDestinationById(id: string): Observable<Destination> {
    return this.http.get<DestinationResponse>(`${this.BASE_URL}/destinations/${id}`).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.error('Error fetching destination by ID:', error);
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
