import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Destination } from '../models/destination.model';
import { Hotel } from '../models/hotel.model';
import { Activity } from '../models/activity.model';

type DestinationFilters = {
    continent?: string;
    climate?: 'tropical' | 'temperate' | 'arid' | 'polar';
    tags?: string[];
    q?: string;
  };

@Injectable({
  providedIn: 'root',
})
export class DestinationsServices {

  // URL de base de l'API
  // https://voyages-a7sf.onrender.com
  
  BASE_URL = environment.apiUrl;
  http = inject(HttpClient);

  getDestinations(): Observable<Destination[]> {
    return this.http.get<Destination[] | { data: Destination[] }>(`${this.BASE_URL}/destinations`).pipe(
      map((response) => Array.isArray(response) ? response : response.data),
      catchError((error) => { 
        console.error('Error fetching destinations:', error);
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
    return this.http.get<Destination | { data: Destination }>(`${this.BASE_URL}/destinations/${id}`).pipe(
      map((response) => ('data' in response ? response.data : response)),
      catchError((error) => {
        console.error('Error fetching destination by ID:', error);
        return throwError(() => error);
      })
    );
  }

  getDestinationContinents(): Observable<string[]> {
    return this.http.get<string[] | { data: string[] }>(`${this.BASE_URL}/destinations/continents`).pipe(
      map((response) => Array.isArray(response) ? response : response.data),
      catchError((error) => {
        console.error('Error fetching destination continents:', error);
        return throwError(() => error);
      })
    );
  }

  getDestinationsByFilters(filters: DestinationFilters): Observable<Destination[]> {
    let params = new HttpParams();

    if (filters.continent) params = params.set('continent', filters.continent);
    if (filters.climate) params = params.set('climate', filters.climate);
    if (filters.q) params = params.set('q', filters.q);
    if (filters.tags?.length) {
      filters.tags.forEach((tag) => {
        params = params.append('tags', tag);
      });
    }

    return this.http.get<Destination[] | { data: Destination[] }>(`${this.BASE_URL}/destinations`, { params }).pipe(
      map((response) => Array.isArray(response) ? response : response.data),
      catchError((error) => {
        console.error('Error fetching destinations with filters:', error);
        return throwError(() => error);
      })
    );
  }

  getDestinationHotels(id: string): Observable<Hotel[]> {
    return this.http.get<Hotel[] | { data: Hotel[] }>(`${this.BASE_URL}/destinations/${id}/hotels`).pipe(
      map((response) => Array.isArray(response) ? response : response.data),
      catchError((error) => {
        console.error('Error fetching destination hotels:', error);
        return throwError(() => error);
      })
    );
  }

  getDestinationActivities(id: string): Observable<Activity[]> {
    return this.http.get<Activity[] | { data: Activity[] }>(`${this.BASE_URL}/destinations/${id}/activities`).pipe(
      map((response) => Array.isArray(response) ? response : response.data),
      catchError((error) => {
        console.error('Error fetching destination activities:', error);
        return throwError(() => error);
      })
    );
  }

}
