import { Component } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-promoted',
  imports: [ButtonModule, CarouselModule, TagModule],
  templateUrl: './promoted.html',
  styleUrl: './promoted.css',
})
export class Promoted {

}
