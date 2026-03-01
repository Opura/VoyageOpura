import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VoyagesServices {

  // URL de base de l'API
  // https://voyages-a7sf.onrender.com

  http = inject(HttpClient);

  getVoyagesPromoted(): Observable<any> {
    return this.http.get('https://voyages-a7sf.onrender.com/voyages/promoted');
  }
  
}
