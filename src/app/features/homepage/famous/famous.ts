import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DestinationsServices } from '../../../core/destinationsServices/destinations.services';
import { Destination } from '../../../core/models/destination.model';

@Component({
  selector: 'app-famous',
  imports: [RouterLink],
  templateUrl: './famous.html',
  styleUrl: './famous.css',
})
export class Famous implements OnInit {
  destinationsServices = inject(DestinationsServices);

  destinations = signal<Destination[]>([]);

  isLoading = signal<boolean>(true);

  error = signal<string | null>(null);

  ngOnInit() {
    this.isLoading.set(true);
    
    this.destinationsServices.getDestinations().subscribe({
      next: (data) => {
        console.log('Destinations fetched successfully:', data);
        this.destinations.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.error.set('Failed to load destinations. Please try again later.');
        this.isLoading.set(false);
        console.error(error);
      }
    });
  }
}
