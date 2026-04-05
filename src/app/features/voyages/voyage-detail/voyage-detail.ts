import { Component, effect, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, filter, map, of, switchMap } from 'rxjs';

import { Header } from "../../../shared/header/header";
import { Footer } from "../../../shared/footer/footer";
import { VoyagesServices } from '../../../core/voyagesServices/voyages.services';
import { ReviewsResponse } from '../../../core/models/reviewsResponse.model';
import { FavorisServices } from '../../../core/favorisServices/favoris.services';

@Component({
  selector: 'app-voyage-detail',
  imports: [Header, Footer, RouterLink, DatePipe, ReactiveFormsModule],
  templateUrl: './voyage-detail.html',
  styleUrl: './voyage-detail.css',
})
export class VoyageDetail {
  voyagesServices = inject(VoyagesServices);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder)
  favorisService = inject(FavorisServices);

  voyageId = this.route.snapshot.paramMap.get('id') || '';

  voyage = toSignal(this.voyagesServices.getVoyageById(this.voyageId), { initialValue: null });
  
  reviewsReload = signal(0);

  // reviews = toSignal<ReviewsResponse | null>(
  //   toObservable(this.reviewsReload).pipe(
  //     switchMap(() => {
  //       if (!this.voyageId) return of(null);
  //       return this.voyagesServices.getVoyageReviews(this.voyageId);
  //     })
  //   ),
  //   { initialValue: null }
  // );

  ratingSteps: Array<1 | 2 | 3 | 4 | 5> = [1, 2, 3, 4, 5];

  // distributionPercent(star: 1 | 2 | 3 | 4 | 5): number {
  //   const stats = this.reviews()?.stats;
  //   if (!stats || stats.total === 0) return 0;
  //   return Math.round((stats.distribution[star] / stats.total) * 100);
  // }

  message: string = '';
  messageType: 'success' | 'error' | '' = '';

  reviewForm = this.fb.group({
    authorName: ['Anonyme', [Validators.required, Validators.minLength(1)]],
    rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
    title: ['', [Validators.required, Validators.minLength(1)]],
    comment: ['', [Validators.required, Validators.minLength(1)]],
  });

  payloadToSend = signal<{
    authorName: string;
    rating: number;
    title: string;
    comment: string;
  } | null>(null);

  isSubmitting = false;

  submitReview(): void {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    if (this.isSubmitting) return;
    if (!this.voyageId) {
      this.showMessage('error', 'Id voyage introuvable');
      return;
    }
    this.isSubmitting = true;

    const formValue = this.reviewForm.value;

    this.payloadToSend.set({
      authorName: formValue.authorName || 'Anonyme',
      rating: formValue.rating || 1,
      title: formValue.title || '',
      comment: formValue.comment || '',
    });
  }

  // sendResult = toSignal(
  //   toObservable(this.payloadToSend).pipe(
  //     filter((payload): payload is { authorName: string; rating: number; title: string; comment: string } => payload !== null),
  //     switchMap((payload) =>
  //       this.voyagesServices.createVoyageReview(this.voyageId, payload).pipe(
  //         map(() => ({ ok: true })),
  //         catchError(() => of({ ok: false }))
  //       )
  //     )
  //   ),
  //   { initialValue: null  }
  // );

  

  // sendEffect = effect(() => {
  //   const result = this.sendResult();
  //   if (!result) return;

  //   if (result.ok) {
  //     this.showMessage('success', 'Avis envoye avec succes');
  //     this.reviewForm.reset({
  //       authorName: 'Anonyme',
  //       rating: null,
  //       title: '',
  //       comment: '',
  //     });

  //     this.reviewsReloadUpdate();
  //   } else {
  //     this.showMessage('error', "Erreur lors de l'envoi de l'avis");
  //   }

  //   this.payloadToSend.set(null);
  //   this.isSubmitting = false;
  // });

  showMessage(type: 'success' | 'error', text: string): void {
    this.messageType = type;
    this.message = text;

    setTimeout(() => {
      this.message = '';
      this.messageType = '';
    }, 3000);
  }

  reviewsReloadUpdate(): void {
    this.reviewsReload.update(v => v + 1);
  }

  toggleFavorite(id: string): void {
    this.favorisService.toggleFavorite(id);
  }

  isFavorite(id: string): boolean {
    return this.favorisService.isFavorite(id);
  }
}

