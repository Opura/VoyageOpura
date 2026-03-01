import { Component } from '@angular/core';
import { Header } from "../../shared/header/header";
import { Hero } from "./hero/hero";
import { Promoted } from "./promoted/promoted";
import { Famous } from "./famous/famous";
import { Search } from "./search/search";
import { Footer } from "../../shared/footer/footer";

@Component({
  selector: 'app-homepage',
  imports: [Header, Hero, Promoted, Famous, Search, Footer],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage {

}
