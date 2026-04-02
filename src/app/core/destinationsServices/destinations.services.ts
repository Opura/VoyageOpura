import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Destination } from '../models/destination.model';

@Injectable({
  providedIn: 'root',
})
export class DestinationsServices {

  // URL de base de l'API
  // https://voyages-a7sf.onrender.com
  
  BASE_URL = environment.apiUrl;
  http = inject(HttpClient);

  getDestinations(): Observable<Destination[]> {
    return this.http.get<Destination[]>(`${this.BASE_URL}/destinations`).pipe(
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
    return this.http.get<Destination>(`${this.BASE_URL}/destinations/${id}`).pipe(
      catchError((error) => {
        console.error('Error fetching destination by ID:', error);
        return throwError(() => error);
      })
    );
  }

}
