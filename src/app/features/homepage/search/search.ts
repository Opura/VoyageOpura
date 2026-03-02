import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  imports: [InputTextModule, FormsModule, RouterLink],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {

  value: string = '';
  
}
