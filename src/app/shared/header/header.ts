import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { FavorisServices } from '../../core/favorisServices/favoris.services';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  favorisService = inject(FavorisServices);
  favoritesCount = this.favorisService.favoritesCount;
}
