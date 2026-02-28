import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

}
