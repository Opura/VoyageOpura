import { Component } from '@angular/core';

import { Header } from "../../../shared/header/header";
import { Footer } from "../../../shared/footer/footer";

@Component({
  selector: 'app-voyages-list',
  imports: [Header, Footer],
  templateUrl: './voyages-list.html',
  styleUrl: './voyages-list.css',
})
export class VoyagesList {

}
