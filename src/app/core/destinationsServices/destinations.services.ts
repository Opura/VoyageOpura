import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Destination } from '../models/destination.model';

interface ApiResponseDestination {
  data: Destination[];
}

interface ApiResponseDestinationById {
  data: Destination;
}

@Injectable({
  providedIn: 'root',
})
export class DestinationsServices {

  // URL de base de l'API
  // https://voyages-a7sf.onrender.com
  
  BASE_URL = environment.apiUrl;
  http = inject(HttpClient);

  getDestinations(): Observable<Destination[]> {
    return this.http.get<ApiResponseDestination>(`${this.BASE_URL}/destinations`).pipe(
      map(response => response.data),
      catchError((error) => {
        console.error('Error fetching destinations:', error);
        return throwError(() => error);
      })
    );
  }

  getDestinationById(id: string): Observable<Destination> {
    return this.http.get<ApiResponseDestinationById>(`${this.BASE_URL}/destinations/${id}`).pipe(
      map(response => response.data),
      catchError((error) => {
        console.error('Error fetching destination by ID:', error);
        return throwError(() => error);
      })
    );
  }
}
