import { Component, inject, signal, OnInit } from '@angular/core';

import { Header } from "../../../shared/header/header";
import { Footer } from "../../../shared/footer/footer";
import { Voyage } from '../../../core/models/voyage.model';
import { VoyagesServices } from '../../../core/voyagesServices/voyages.services';

@Component({
  selector: 'app-voyages-list',
  imports: [Header, Footer],
  templateUrl: './voyages-list.html',
  styleUrl: './voyages-list.css',
})
export class VoyagesList implements OnInit {
  voyagesServices = inject(VoyagesServices);

  voyages = signal<Voyage[]>([]);

  isLoading = signal<boolean>(true);

  error = signal<string | null>(null);

  ngOnInit() {
    this.isLoading.set(true);

    this.voyagesServices.getVoyages().subscribe({
      next: (voyages) => {
        this.voyages.set(voyages);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.error.set('Failed to load voyages. Please try again later.');
        this.isLoading.set(false);
        console.error(error);
      }
    });
  }

}
