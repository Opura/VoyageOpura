import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';


import { Header } from "../../../shared/header/header";
import { Footer } from "../../../shared/footer/footer";
import { Voyage } from '../../../core/models/voyage.model';
import { VoyagesServices } from '../../../core/voyagesServices/voyages.services';
import { FavorisServices } from '../../../core/favorisServices/favoris.services';
import { DestinationsServices } from '../../../core/destinationsServices/destinations.services';
import { Destination } from '../../../core/models/destination.model';
import { ButtonModule } from 'primeng/button';
import { firstValueFrom } from 'rxjs';
import { SearchDrawer } from "../search-drawer/search-drawer";

@Component({
  selector: 'app-voyages-list',
  imports: [Header, Footer, ButtonModule, RouterLink, SearchDrawer],
  templateUrl: './voyages-list.html',
  styleUrl: './voyages-list.css',
})
export class VoyagesList implements OnInit {
  voyagesServices = inject(VoyagesServices);
  destinationsServices = inject(DestinationsServices);
  favorisService = inject(FavorisServices);
  route = inject(ActivatedRoute);

  currentPage = signal(1);
  visible = false;
  totalPages = 1;
  voyages = signal<Voyage[]>([]);

  allVoyages = toSignal(this.voyagesServices.getAllVoyages(), { initialValue: [] as Voyage[] });
  allDestinations = toSignal(this.destinationsServices.getAllDestinations(), { initialValue: [] as Destination[] });

  private params = toSignal(this.route.queryParams, { initialValue: {} as Params });

  hasActiveFilters = computed(() => {
    const p = this.params();
    const filterKeys = [
      'q',
      'category',
      'continent',
      'minPrice',
      'maxPrice',
      'minDuration',
      'maxDuration',
      'departureFrom',
      'departureTo',
      'availableOnly',
      'difficultyLevel',
      'sortBy',
      'destinationId',
    ];

    return filterKeys.some((key) => {
      const value = p[key];
      return value !== undefined && value !== null && value !== '';
    });
  });

  filteredVoyages = computed(() => {
    const p = this.params();
    let result = this.allVoyages();

    const query = (typeof p['q'] === 'string' ? p['q'] : '').toLowerCase().trim();
    const category = typeof p['category'] === 'string' ? p['category'] : '';
    const continent = typeof p['continent'] === 'string' ? p['continent'] : '';
    const destinationId = typeof p['destinationId'] === 'string' ? p['destinationId'] : '';
    const departureFrom = typeof p['departureFrom'] === 'string' ? p['departureFrom'] : '';
    const departureTo = typeof p['departureTo'] === 'string' ? p['departureTo'] : '';
    const availableOnly = p['availableOnly'] === 'true';
    const difficultyLevel = typeof p['difficultyLevel'] === 'string' ? p['difficultyLevel'] : '';
    const sortBy = typeof p['sortBy'] === 'string' ? p['sortBy'] : 'price_asc';

    const minPrice = this.toNumberParam(p['minPrice']);
    const maxPrice = this.toNumberParam(p['maxPrice']);
    const minDuration = this.toNumberParam(p['minDuration']);
    const maxDuration = this.toNumberParam(p['maxDuration']);

    if (query) {
      result = result.filter((v) => {
        const destination = this.allDestinations().find((d) => d.id === v.destinationId);
        const destinationName = destination?.name?.toLowerCase() ?? '';
        return (
          v.title.toLowerCase().includes(query) ||
          v.description.toLowerCase().includes(query) ||
          destinationName.includes(query)
        );
      });
    }

    if (category) {
      result = result.filter((v) => v.category === category);
    }

    if (continent) {
      result = result.filter((v) => {
        const destination = this.allDestinations().find((d) => d.id === v.destinationId);
        return destination?.continent === continent;
      });
    }

    if (destinationId) {
      result = result.filter((v) => v.destinationId === destinationId);
    }

    if (minPrice !== null) {
      result = result.filter((v) => v.price >= minPrice);
    }

    if (maxPrice !== null) {
      result = result.filter((v) => v.price <= maxPrice);
    }

    if (minDuration !== null) {
      result = result.filter((v) => v.duration >= minDuration);
    }

    if (maxDuration !== null) {
      result = result.filter((v) => v.duration <= maxDuration);
    }

    if (departureFrom) {
      result = result.filter((v) => v.departureDate >= departureFrom);
    }

    if (departureTo) {
      result = result.filter((v) => v.departureDate <= departureTo);
    }

    if (availableOnly) {
      result = result.filter((v) => v.availableSeats > 0);
    }

    if (difficultyLevel) {
      result = result.filter((v) => v.difficultyLevel === difficultyLevel);
    }

    switch (sortBy) {
      case 'price_desc':
        result = result.slice().sort((a, b) => b.price - a.price);
        break;
      case 'rating_desc':
        result = result.slice().sort((a, b) => b.averageRating - a.averageRating);
        break;
      case 'duration_asc':
        result = result.slice().sort((a, b) => a.duration - b.duration);
        break;
      case 'departure_asc':
        result = result.slice().sort((a, b) => a.departureDate.localeCompare(b.departureDate));
        break;
      case 'popularity':
        result = result.slice().sort((a, b) => b.averageRating - a.averageRating);
        break;
      default:
        result = result.slice().sort((a, b) => a.price - b.price);
        break;
    }

    return result;
  });

  displayedVoyages = computed(() => (this.hasActiveFilters() ? this.filteredVoyages() : this.voyages()));

  isLoading = computed(() => (this.hasActiveFilters() ? this.allVoyages().length === 0 : this.voyages().length === 0));
  
  async loadVoyages(): Promise<void> {
    try {
      const voyagesResponse = await firstValueFrom(this.voyagesServices.getVoyagesPage(this.currentPage()));
      this.voyages.set(voyagesResponse.data ?? []);
      this.totalPages = Math.max(voyagesResponse.meta?.totalPages ?? 1, 1);
    } catch (error) {
      console.error('Error fetching voyages:', error);
      this.voyages.set([]);
      this.totalPages = 1;
    }
  }

  ngOnInit(): void {
    this.loadVoyages();
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
      this.loadVoyages();
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages) {
      this.currentPage.set(this.currentPage() + 1);
      this.loadVoyages();
    }
  }

  toggleFavorite(id: string): void {
    this.favorisService.toggleFavorite(id);
  }

  isFavorite(id: string): boolean {
    return this.favorisService.isFavorite(id);
  }

  private toNumberParam(value: unknown): number | null {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === 'string' && value.trim() !== '') {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
  }
}
