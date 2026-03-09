import { Component, signal, computed, effect, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Header } from "../../../shared/header/header";
import { Footer } from "../../../shared/footer/footer";
import { Voyage } from '../../../core/models/voyage.model';
import { VoyagesServices } from '../../../core/voyagesServices/voyages.services';

import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-voyages-list',
  imports: [Header, Footer, DrawerModule, ButtonModule, FormsModule],
  templateUrl: './voyages-list.html',
  styleUrl: './voyages-list.css',
})
export class VoyagesList {
  voyagesServices = inject(VoyagesServices);
  router = inject(Router);
  route = inject(ActivatedRoute);

  currentPage = signal(1);
  totalPages = 5;
  voyages = signal<Voyage[]>([]);

  // Filtres (pour le drawer)
  visible = false;
  searchText = signal('');
  category = signal('');
  continent = signal('');
  priceMin = signal<number | null>(null);
  priceMax = signal<number | null>(null);
  durationMin = signal<number | null>(null);
  durationMax = signal<number | null>(null);
  departureDate = signal('');
  onlyAvailable = signal(false);
  difficulty = signal('');
  sortOption = signal('priceAsc');

  constructor() {
    // Charge les voyages de la page courante
    effect((): void => {
      this.voyagesServices.getVoyages(this.currentPage()).subscribe(v => this.voyages.set(v));
    });
  }

  previousPage(): void {
    if (this.currentPage() > 1) this.currentPage.set(this.currentPage() - 1);
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages) this.currentPage.set(this.currentPage() + 1);
  }

  // Redirige vers la page de résultats avec les filtres dans l'URL
  applyFilters(): void {
    this.router.navigate(['/voyages/search'], {
      queryParams: {
        searchText: this.searchText() || null,
        category: this.category() || null,
        continent: this.continent() || null,
        priceMin: this.priceMin() || null,
        priceMax: this.priceMax() || null,
        durationMin: this.durationMin() || null,
        durationMax: this.durationMax() || null,
        departureDate: this.departureDate() || null,
        onlyAvailable: this.onlyAvailable() ? 'true' : null,
        difficulty: this.difficulty() || null,
        sortOption: this.sortOption() || null,
      }
    });
    this.visible = false;
  }

  resetFilters(): void {
    this.searchText.set('');
    this.category.set('');
    this.continent.set('');
    this.priceMin.set(null);
    this.priceMax.set(null);
    this.durationMin.set(null);
    this.durationMax.set(null);
    this.departureDate.set('');
    this.onlyAvailable.set(false);
    this.difficulty.set('');
    this.sortOption.set('priceAsc');
  }
}
