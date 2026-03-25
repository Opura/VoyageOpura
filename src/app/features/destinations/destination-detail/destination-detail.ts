import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { Header } from "../../../shared/header/header";
import { Footer } from "../../../shared/footer/footer";
import { DestinationsServices } from '../../../core/destinationsServices/destinations.services';

@Component({
  selector: 'app-destination-detail',
  imports: [Header, Footer],
  templateUrl: './destination-detail.html',
  styleUrl: './destination-detail.css',
})
export class DestinationDetail {
  destinationsServices = inject(DestinationsServices);
  route = inject(ActivatedRoute);

  destinationId = this.route.snapshot.paramMap.get('id') || '';

  destination = toSignal(
    this.destinationsServices.getDestinationById(this.destinationId),
    { initialValue: null }
  );
}
