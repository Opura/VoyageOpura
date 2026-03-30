import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';

import { Header } from "../../shared/header/header";
import { Footer } from "../../shared/footer/footer";
import { VoyagesServices } from '../../core/voyagesServices/voyages.services';
import { FavorisServices } from '../../core/favorisServices/favoris.services';
import { Voyage } from '../../core/models/voyage.model';

@Component({
  selector: 'app-favoris',
  imports: [Header, Footer, RouterLink],
  templateUrl: './favoris.html',
  styleUrl: './favoris.css',
})
export class Favoris {

  voyagesService = inject(VoyagesServices);
  favorisService = inject(FavorisServices);

  favoritesIds = this.favorisService.favoriteIds;

  hasFavorites = computed(() => this.favoritesIds().length > 0);

  favoriteVoyages = toSignal(
    toObservable(this.favoritesIds).pipe(
      switchMap(ids => {
        if (ids.length === 0) return of([]);
        return forkJoin(ids.map(id =>
          this.voyagesService.getVoyageById(id).pipe(
            catchError(() => of(null)) 
          )
        )).pipe(
          map(voyages => voyages.filter((v): v is Voyage => v !== null))
        );
      })
    ),
    { initialValue: [] }
  );

  toggleFavorite(id: string): void {
    this.favorisService.toggleFavorite(id);
  }

  isFavorite(id: string): boolean {
    return this.favorisService.isFavorite(id);
  }
}
