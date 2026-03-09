import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, forkJoin, map, Observable, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Voyage } from '../models/voyage.model';

interface ApiResponse {
  data: Voyage[];
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
    return this.http.get<ApiResponse>(`${this.BASE_URL}/voyages/featured`).pipe(
      map(response => response.data.filter(voyage => voyage.isPromoted === true)),
      catchError((error) => {
        console.error('Error fetching promoted voyages:', error);
        return throwError(() => error);
      })
    );
  }

  getVoyages(page: number = 1): Observable<Voyage[]> {
    return this.http.get<ApiResponse>(`${this.BASE_URL}/voyages?page=${page}`).pipe(
      map(response => response.data),
      catchError((error) => {
        console.error('Error fetching voyages:', error);
        return throwError(() => error);
      })
    );
  }
  
  getAllVoyages(): Observable<Voyage[]> {
    const totalPages = 5;
    const requests = Array.from({ length: totalPages }, (_, i) =>
      this.getVoyages(i + 1)
    );
    return forkJoin(requests).pipe(
      map(pages => pages.flat()),
      catchError((error) => {
        console.error('Error fetching all voyages:', error);
        return throwError(() => error);
      })
    );
  }
}
