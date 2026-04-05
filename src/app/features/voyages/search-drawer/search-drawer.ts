import { Component, effect, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';

import { VoyagesServices } from '../../../core/voyagesServices/voyages.services';
import { Voyage } from '../../../core/models/voyage.model';
import { DestinationsServices } from '../../../core/destinationsServices/destinations.services';

interface VoyageFiltersFormValue {
  q: string;
  category: string;
  continent: string;
  minPrice: number | null;
  maxPrice: number | null;
  minDuration: number | null;
  maxDuration: number | null;
  departureFrom: string;
  departureTo: string;
  availableOnly: boolean;
  difficultyLevel: string;
  sortBy: string;
}

@Component({
  selector: 'app-search-drawer',
  imports: [DrawerModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './search-drawer.html',
  styleUrl: './search-drawer.css',
})
export class SearchDrawer {
  router = inject(Router);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  voyagesServices = inject(VoyagesServices);
  destinationsServices = inject(DestinationsServices);

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  categories = toSignal(this.voyagesServices.getVoyageCategories(), { initialValue: [] as Voyage['category'][] });
  continents = toSignal(this.destinationsServices.getDestinationContinents(), { initialValue: [] as string[] });
  queryParams = toSignal(this.route.queryParams, { initialValue: {} as Params });

  private syncingFromUrl = false;
  private hasPatchedFromUrl = false;

  filtersForm = this.fb.group({
    q: this.fb.nonNullable.control(''),
    category: this.fb.nonNullable.control(''),
    continent: this.fb.nonNullable.control(''),
    minPrice: this.fb.control<number | null>(null),
    maxPrice: this.fb.control<number | null>(null),
    minDuration: this.fb.control<number | null>(null),
    maxDuration: this.fb.control<number | null>(null),
    departureFrom: this.fb.nonNullable.control(''),
    departureTo: this.fb.nonNullable.control(''),
    availableOnly: this.fb.nonNullable.control(false),
    difficultyLevel: this.fb.nonNullable.control(''),
    sortBy: this.fb.nonNullable.control('price_asc'),
  });

  debouncedFormValue = toSignal(this.filtersForm.valueChanges.pipe(debounceTime(400)), {
    initialValue: this.filtersForm.getRawValue(),
  });

  constructor() {
    effect(() => {
      const params = this.queryParams();
      this.syncingFromUrl = true;
      this.filtersForm.patchValue(this.toFormValue(params), { emitEvent: false });
      this.syncingFromUrl = false;
      this.hasPatchedFromUrl = true;
    });

    effect(() => {
      this.debouncedFormValue();
      if (!this.hasPatchedFromUrl || this.syncingFromUrl) return;
      this.applyFilters();
    });
  }

  getDefaultFilters(): VoyageFiltersFormValue {
    return {
      q: '',
      category: '',
      continent: '',
      minPrice: null,
      maxPrice: null,
      minDuration: null,
      maxDuration: null,
      departureFrom: '',
      departureTo: '',
      availableOnly: false,
      difficultyLevel: '',
      sortBy: 'price_asc',
    };
  }

  submit(): void {
    this.applyFilters();
    this.visible = false;
    this.visibleChange.emit(false);
  }

  reset(): void {
    this.filtersForm.reset(this.getDefaultFilters());
    this.applyFilters();
  }

  private applyFilters(): void {
    const raw = this.filtersForm.getRawValue();
    const destinationId = this.route.snapshot.queryParamMap.get('destinationId');

    this.router.navigate(['/voyages'], {
      queryParams: {
        q: raw.q || null,
        category: raw.category || null,
        continent: raw.continent || null,
        minPrice: raw.minPrice ?? null,
        maxPrice: raw.maxPrice ?? null,
        minDuration: raw.minDuration ?? null,
        maxDuration: raw.maxDuration ?? null,
        departureFrom: raw.departureFrom || null,
        departureTo: raw.departureTo || null,
        availableOnly: raw.availableOnly ? 'true' : null,
        difficultyLevel: raw.difficultyLevel || null,
        sortBy: raw.sortBy || null,
        destinationId: destinationId || null,
      }
    });
  }

  private toFormValue(params: Params): VoyageFiltersFormValue {
    return {
      q: this.toStringParam(params['q']),
      category: this.toStringParam(params['category']),
      continent: this.toStringParam(params['continent']),
      minPrice: this.toNumberParam(params['minPrice']),
      maxPrice: this.toNumberParam(params['maxPrice']),
      minDuration: this.toNumberParam(params['minDuration']),
      maxDuration: this.toNumberParam(params['maxDuration']),
      departureFrom: this.toStringParam(params['departureFrom']),
      departureTo: this.toStringParam(params['departureTo']),
      availableOnly: params['availableOnly'] === 'true',
      difficultyLevel: this.toStringParam(params['difficultyLevel']),
      sortBy: this.toStringParam(params['sortBy']) || 'price_asc',
    };
  }

  private toStringParam(param: unknown): string {
    return typeof param === 'string' ? param : '';
  }

  private toNumberParam(param: unknown): number | null {
    if (typeof param === 'number' && Number.isFinite(param)) {
      return param;
    }
    if (typeof param === 'string' && param.trim() !== '') {
      const parsed = Number(param);
      return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
  }
}
