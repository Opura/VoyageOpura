import { Component, signal, computed, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';


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

  previousPage() {
    if (this.currentPage() > 1) this.currentPage.set(this.currentPage() - 1);
  };

  nextPage() {
    this.currentPage.set(this.currentPage() + 1);
  }

  visible: boolean = false;

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
    let result = this.voyages();

    if (this.searchText()) {
      const searchLower = this.searchText().toLowerCase();
      result = result.filter(v => v.title?.toLowerCase().includes(searchLower));
    }
    if (this.category()) {
      result = result.filter(v => v.category === this.category());
    }
    // if (this.continent) {
    //   result = result.filter(v => v.continent === this.continent);
    // }
    // if (this.priceMin !== null) {
    //   result = result.filter(v => typeof v.price === 'number' && v.price >= this.priceMin!);
    // }
    // if (this.priceMax !== null) {
    //   result = result.filter(v => typeof v.price === 'number' && v.price <= this.priceMax!);
    // }
    // if (this.durationMin !== null) {
    //   result = result.filter(v => typeof v.duration === 'number' && v.duration >= this.durationMin!);
    // }
    // if (this.durationMax !== null) {
    //   result = result.filter(v => typeof v.duration === 'number' && v.duration <= this.durationMax!);
    // }
    // if (this.departureDate) {
    //   result = result.filter(v => v.departureDate && v.departureDate >= this.departureDate);
    // }
    // if (this.onlyAvailable) {
    //   result = result.filter(v => v.available === true);
    // }
    // if (this.difficulty) {
    //   result = result.filter(v => v.difficulty === this.difficulty);
    // }

    // Tri (ajoute des gardes aussi si besoin)
    // switch (this.sortOption) {
    //   case 'priceAsc':
    //     result = result.slice().sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    //     break;
    //   case 'priceDesc':
    //     result = result.slice().sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    //     break;
    //   case 'durationAsc':
    //     result = result.slice().sort((a, b) => (a.duration ?? 0) - (b.duration ?? 0));
    //     break;
    //   case 'departureSoon':
    //     result = result.slice().sort((a, b) => (a.departureDate ?? '').localeCompare(b.departureDate ?? ''));
    //     break;
      // Ajoute les autres tris si besoin
    // }

    return result;
  });

  toggleFilters() {
    this.visible = !this.visible;
  }

  constructor() {
    effect((): void => {
      this.voyagesServices.getVoyages(this.currentPage()).subscribe(v => this.voyages.set(v));
    });

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
      this.currentPage.set(params['currentPage'] ? Number(params['currentPage']) : 1);
    });
  }

  applyFilters() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        searchText: this.searchText(),
        category: this.category(),
        continent: this.continent(),
        priceMin: this.priceMin(),
        priceMax: this.priceMax(),
        durationMin: this.durationMin(),
        durationMax: this.durationMax(),
        departureDate: this.departureDate(),
        onlyAvailable: this.onlyAvailable() ? 'true' : null,
        difficulty: this.difficulty(),
        sortOption: this.sortOption(),
        currentPage: this.currentPage(),
      },
      queryParamsHandling: 'merge'
    });
    this.visible = false;
  }

  resetFilters() {
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
    this.currentPage.set(1);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        searchText: null,
        category: null,
        continent: null,
        priceMin: null,
        priceMax: null,
        durationMin: null,
        durationMax: null,
        departureDate: null,
        onlyAvailable: null,
        difficulty: null,
        sortOption: null,
        currentPage: null,
      },
      queryParamsHandling: 'merge'
    });
  }

}
