import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { Header } from "../../../shared/header/header";
import { Footer } from "../../../shared/footer/footer";
import { Voyage } from '../../../core/models/voyage.model';
import { Destination } from '../../../core/models/destination.model';
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

  // Données
  allVoyages = toSignal(this.voyagesServices.getAllVoyages(), { initialValue: [] as Voyage[] });
  allDestinations = toSignal(this.voyagesServices.getAllDestinations(), { initialValue: [] as Destination[] });
  isLoading = computed(() => this.allVoyages().length === 0);

  // Filtres lus depuis l'URL via toSignal
  private params = toSignal(this.route.queryParams, { initialValue: {} as Params });

  searchText  = computed(() => this.params()['searchText'] || '');
  category    = computed(() => this.params()['category'] || '');
  continent   = computed(() => this.params()['continent'] || '');
  priceMin    = computed(() => this.params()['priceMin'] ? Number(this.params()['priceMin']) : null);
  priceMax    = computed(() => this.params()['priceMax'] ? Number(this.params()['priceMax']) : null);
  durationMin = computed(() => this.params()['durationMin'] ? Number(this.params()['durationMin']) : null);
  durationMax = computed(() => this.params()['durationMax'] ? Number(this.params()['durationMax']) : null);
  departureDate  = computed(() => this.params()['departureDate'] || '');
  onlyAvailable  = computed(() => this.params()['onlyAvailable'] === 'true');
  difficulty     = computed(() => this.params()['difficulty'] || '');
  sortOption     = computed(() => this.params()['sortOption'] || 'priceAsc');

  filteredVoyages = computed(() => {
    let result = this.allVoyages();

    if (this.searchText()) {
      const s = this.searchText().toLowerCase();
      result = result.filter(v => v.title?.toLowerCase().includes(s));
    }
    if (this.category()) {
      result = result.filter(v => v.category === this.category());
    }
    if (this.continent()) {
      result = result.filter(v => {
        const dest = this.allDestinations().find(d => d.id === v.destinationId);
        return dest?.continent === this.continent();
      });
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
      case 'priceAsc':    result = result.slice().sort((a, b) => a.price - b.price); break;
      case 'priceDesc':   result = result.slice().sort((a, b) => b.price - a.price); break;
      case 'bestRating':  result = result.slice().sort((a, b) => b.averageRating - a.averageRating); break;
      case 'durationAsc': result = result.slice().sort((a, b) => a.duration - b.duration); break;
      case 'departureSoon': result = result.slice().sort((a, b) => a.departureDate.localeCompare(b.departureDate)); break;
    }

    return result;
  });

  backToCatalogue(): void {
    this.router.navigate(['/voyages']);
  }
}
