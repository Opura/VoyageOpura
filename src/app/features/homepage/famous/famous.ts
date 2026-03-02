import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { DestinationsServices } from '../../../core/destinationsServices/destinations.services';
import { Destination } from '../../../core/models/destination.model';

@Component({
  selector: 'app-famous',
  imports: [RouterLink],
  templateUrl: './famous.html',
  styleUrl: './famous.css',
})
export class Famous  {
  destinationsServices = inject(DestinationsServices);

  destinations = toSignal(this.destinationsServices.getDestinations(), { initialValue: [] as Destination[] });
}
