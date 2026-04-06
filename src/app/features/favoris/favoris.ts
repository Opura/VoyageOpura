import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

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

  favoriteVoyages = signal<Voyage[]>([]);

  async ngOnInit(): Promise<void> {
    await this.loadFavoris();
  }

  async loadFavoris(): Promise<void> {
    const ids = this.favoritesIds();

    if (ids.length === 0) {
      this.favoriteVoyages.set([]);
      return;
    }

    const liste: Voyage[] = [];

    for (const id of ids) {
      try {
        const voyage = await firstValueFrom(this.voyagesService.getVoyageById(id));
        liste.push(voyage);
      } catch (error) {
        console.error(`Failed to load voyage with id ${id}:`, error);
      }
    }

    this.favoriteVoyages.set(liste);
  }

  async toggleFavorite(id: string): Promise<void> {
    this.favorisService.toggleFavorite(id);
    await this.loadFavoris();
  }

  isFavorite(id: string): boolean {
    return this.favorisService.isFavorite(id);
  }
}
