import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';

import { VoyagesServices } from '../../../core/voyagesServices/voyages.services';
import { Voyage } from '../../../core/models/voyage.model';

@Component({
  selector: 'app-promoted',
  imports: [ButtonModule, CarouselModule, TagModule, RouterLink],
  templateUrl: './promoted.html',
  styleUrl: './promoted.css',
  providers: [VoyagesServices]
})
export class Promoted implements OnInit {
  voyagesServices = inject(VoyagesServices);

  voyagesPromoted= signal<Voyage[]>([]);

  isLoading = signal<boolean>(true);

  error = signal<string | null>(null);

  responsiveOptions: any[] | undefined;

  ngOnInit() {
    this.isLoading.set(true);
    
    this.voyagesServices.getVoyagesPromoted().subscribe({
      next: (data) => {
        console.log('Promoted voyages fetched successfully:', data);
        this.voyagesPromoted.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.error.set('Failed to load promoted voyages. Please try again later.');
        this.isLoading.set(false);
        console.error(error);
      }
    });

    this.responsiveOptions = [
      {
          breakpoint: '1400px',
          numVisible: 2,
          numScroll: 1
      },
      {
          breakpoint: '1199px',
          numVisible: 3,
          numScroll: 1
      },
      {
          breakpoint: '767px',
          numVisible: 2,
          numScroll: 1
      },
      {
          breakpoint: '575px',
          numVisible: 1,
          numScroll: 1
      }
    ];
  }
}
