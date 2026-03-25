import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { Header } from "../../../shared/header/header";
import { Footer } from "../../../shared/footer/footer";
import { Destination } from '../../../core/models/destination.model';
import { DestinationsServices } from '../../../core/destinationsServices/destinations.services';

@Component({
  selector: 'app-destinations-list',
  imports: [Header, Footer, RouterLink],
  templateUrl: './destinations-list.html',
  styleUrl: './destinations-list.css',
})
export class DestinationsList {
  destinationsServices = inject(DestinationsServices);

  destinations = toSignal(
    this.destinationsServices.getDestinations(),
    { initialValue: [] as Destination[] }
  );
}
