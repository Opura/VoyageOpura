import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { Header } from '../../../shared/header/header';
import { Footer } from '../../../shared/footer/footer';
import { Destination } from '../../../core/models/destination.model';
import { DestinationsServices } from '../../../core/destinationsServices/destinations.services';

type ClimateFilter = '' | 'tropical' | 'temperate' | 'arid' | 'polar';

@Component({
  selector: 'app-destinations-list',
  imports: [Header, Footer, RouterLink, FormsModule],
  templateUrl: './destinations-list.html',
  styleUrl: './destinations-list.css',
})
export class DestinationsList {
  destinationsServices = inject(DestinationsServices);

  destinations = signal<Destination[]>([]);
  continents = signal<string[]>([]);

  selectedContinent = signal('');
  selectedClimate = signal<ClimateFilter>('');

  isLoading = signal(false);
  errorMessage = signal('');

  async ngOnInit(): Promise<void> {
    await this.loadContinents();
    await this.loadDestinations();
  }

  async loadContinents(): Promise<void> {
    try {
      const data = await firstValueFrom(this.destinationsServices.getDestinationContinents());
      this.continents.set(data);
    } catch {
    this.continents.set([]);
    }
  }

  async loadDestinations(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const filters = {
        continent: this.selectedContinent() || undefined,
        climate: this.selectedClimate() || undefined,
      };
      const data = await firstValueFrom(this.destinationsServices.getDestinationsByFilters(filters));
      this.destinations.set(data);
    } catch {
      this.errorMessage.set('Impossible de charger les destinations.');
      this.destinations.set([]);
    } finally {
      this.isLoading.set(false);
    }
  }



  async onContinentChange(value: string): Promise<void> {
  this.selectedContinent.set(value);
  await this.loadDestinations();
  }

  async onClimateChange(value: ClimateFilter): Promise<void> {
  this.selectedClimate.set(value);
  await this.loadDestinations();
  }

  async resetFilters(): Promise<void> {
  this.selectedContinent.set('');
  this.selectedClimate.set('');
  await this.loadDestinations();
  }

}