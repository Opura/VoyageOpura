import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

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
})
export class Promoted {
  voyagesServices = inject(VoyagesServices);

  voyagesPromoted= toSignal(this.voyagesServices.getVoyagesPromoted(), { initialValue: [] as Voyage[] });

  responsiveOptions: any[] | undefined;

  ngOnInit() {
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
