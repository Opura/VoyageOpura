import { Component, signal, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Header } from "../../../shared/header/header";
import { Footer } from "../../../shared/footer/footer";
import { Voyage } from '../../../core/models/voyage.model';
import { VoyagesServices } from '../../../core/voyagesServices/voyages.services';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-search-results',
  imports: [Header, Footer, ButtonModule],
  templateUrl: './search-results.html',
  styleUrl: './search-results.css',
})
export class SearchResults {
  voyagesServices = inject(VoyagesServices);
  route = inject(ActivatedRoute);
  router = inject(Router);

  allVoyages = signal<Voyage[]>([]);
  isLoading = signal(true);

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

  filteredVoyages = computed(() => {
    let result = this.allVoyages();

    if (this.searchText()) {
      const s = this.searchText().toLowerCase();
      result = result.filter(v => v.title?.toLowerCase().includes(s));
    }
    if (this.category()) {
      result = result.filter(v => v.category === this.category());
    }
    if (this.priceMin() !== null) {
      result = result.filter(v => v.price >= this.priceMin()!);
    }
    if (this.priceMax() !== null) {
      result = result.filter(v => v.price <= this.priceMax()!);
    }
    if (this.durationMin() !== null) {
      result = result.filter(v => v.duration >= this.durationMin()!);
    }
    if (this.durationMax() !== null) {
      result = result.filter(v => v.duration <= this.durationMax()!);
    }
    if (this.departureDate()) {
      result = result.filter(v => v.departureDate >= this.departureDate());
    }
    if (this.onlyAvailable()) {
      result = result.filter(v => v.availableSeats > 0);
    }
    if (this.difficulty()) {
      result = result.filter(v => v.difficultyLevel === this.difficulty());
    }

    switch (this.sortOption()) {
      case 'priceAsc':
        result = result.slice().sort((a, b) => a.price - b.price); break;
      case 'priceDesc':
        result = result.slice().sort((a, b) => b.price - a.price); break;
      case 'bestRating':
        result = result.slice().sort((a, b) => b.averageRating - a.averageRating); break;
      case 'durationAsc':
        result = result.slice().sort((a, b) => a.duration - b.duration); break;
      case 'departureSoon':
        result = result.slice().sort((a, b) => a.departureDate.localeCompare(b.departureDate)); break;
    }

    return result;
  });

  constructor() {
    // Charge tous les voyages
    this.voyagesServices.getAllVoyages().subscribe(voyages => {
      this.allVoyages.set(voyages);
      this.isLoading.set(false);
    });

    // Lit les filtres depuis l'URL
    this.route.queryParams.subscribe(params => {
      this.searchText.set(params['searchText'] || '');
      this.category.set(params['category'] || '');
      this.continent.set(params['continent'] || '');
      this.priceMin.set(params['priceMin'] ? Number(params['priceMin']) : null);
      this.priceMax.set(params['priceMax'] ? Number(params['priceMax']) : null);
      this.durationMin.set(params['durationMin'] ? Number(params['durationMin']) : null);
      this.durationMax.set(params['durationMax'] ? Number(params['durationMax']) : null);
      this.departureDate.set(params['departureDate'] || '');
      this.onlyAvailable.set(params['onlyAvailable'] === 'true');
      this.difficulty.set(params['difficulty'] || '');
      this.sortOption.set(params['sortOption'] || 'priceAsc');
    });
  }

  backToCatalogue(): void {
    this.router.navigate(['/voyages']);
  }
}
