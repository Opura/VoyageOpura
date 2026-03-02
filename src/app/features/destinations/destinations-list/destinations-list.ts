import { Component } from '@angular/core';

import { Header } from "../../../shared/header/header";
import { Footer } from "../../../shared/footer/footer";

@Component({
  selector: 'app-destinations-list',
  imports: [Header, Footer],
  templateUrl: './destinations-list.html',
  styleUrl: './destinations-list.css',
})
export class DestinationsList {

}
