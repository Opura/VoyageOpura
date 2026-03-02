import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

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
export class VoyagesList {
  voyagesServices = inject(VoyagesServices);

  voyages = toSignal(this.voyagesServices.getVoyages(), { initialValue: [] as Voyage[] });

}
