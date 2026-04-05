import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, switchMap } from 'rxjs';

import { Header } from "../../../shared/header/header";
import { Footer } from "../../../shared/footer/footer";
import { Destination } from '../../../core/models/destination.model';
import { DestinationsServices } from '../../../core/destinationsServices/destinations.services';

@Component({
  selector: 'app-destinations-list',
  imports: [Header, Footer, RouterLink, ReactiveFormsModule],
  templateUrl: './destinations-list.html',
  styleUrl: './destinations-list.css',
})
export class DestinationsList {
  destinationsServices = inject(DestinationsServices);
  route = inject(ActivatedRoute);
  router = inject(Router);
  fb = inject(FormBuilder);

  private syncingFromUrl = false;
  private hasPatchedFromUrl = false;

  filtersForm = this.fb.group({
    continent: this.fb.nonNullable.control(''),
    climate: this.fb.nonNullable.control(''),
  });

  continents = toSignal(this.destinationsServices.getDestinationContinents(), { initialValue: [] as string[] });
  queryParams = toSignal(this.route.queryParams, { initialValue: {} as Params });

  debouncedFormValue = toSignal(this.filtersForm.valueChanges.pipe(debounceTime(250)), {
    initialValue: this.filtersForm.getRawValue(),
  });

  destinations = toSignal(
    this.route.queryParams.pipe(
      switchMap((params) =>
        this.destinationsServices.getDestinations({
          continent: typeof params['continent'] === 'string' ? params['continent'] : undefined,
          climate: typeof params['climate'] === 'string' ? params['climate'] : undefined,
        })
      )
    ),
    { initialValue: [] as Destination[] }
  );

  constructor() {
    effect(() => {
      const params = this.queryParams();
      this.syncingFromUrl = true;
      this.filtersForm.patchValue(this.toFormValue(params), { emitEvent: false });
      this.syncingFromUrl = false;
      this.hasPatchedFromUrl = true;
    });

    effect(() => {
      const value = this.debouncedFormValue();
      if (!this.hasPatchedFromUrl || this.syncingFromUrl) return;

      this.router.navigate(['/destinations'], {
        queryParams: {
          continent: value.continent || null,
          climate: value.climate || null,
        },
      });
    });
  }

  resetFilters(): void {
    this.filtersForm.reset({ continent: '', climate: '' });
  }

  private toFormValue(params: Params): { continent: string; climate: string } {
    return {
      continent: typeof params['continent'] === 'string' ? params['continent'] : '',
      climate: typeof params['climate'] === 'string' ? params['climate'] : '',
    };
  }
}
