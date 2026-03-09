import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { Header } from "../../../shared/header/header";
import { Footer } from "../../../shared/footer/footer";
import { Voyage } from '../../../core/models/voyage.model';
import { VoyagesServices } from '../../../core/voyagesServices/voyages.services';

import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-voyages-list',
  imports: [Header, Footer, DrawerModule, ButtonModule],
  templateUrl: './voyages-list.html',
  styleUrl: './voyages-list.css',
})
export class VoyagesList {
  voyagesServices = inject(VoyagesServices);

  voyages = toSignal(this.voyagesServices.getVoyages(), { initialValue: [] as Voyage[] });

  visible: boolean = false;

}
