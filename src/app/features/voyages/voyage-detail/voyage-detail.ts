import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';

import { Header } from '../../../shared/header/header';
import { Footer } from '../../../shared/footer/footer';
import { VoyagesServices } from '../../../core/voyagesServices/voyages.services';
import { FavorisServices } from '../../../core/favorisServices/favoris.services';
import { ReviewsResponse } from '../../../core/models/reviewsResponse.model';
import { ReviewsServices } from '../../../core/reviewsServices/reviews-services';

@Component({
  selector: 'app-voyage-detail',
  imports: [Header, Footer, RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './voyage-detail.html',
  styleUrl: './voyage-detail.css',
})
export class VoyageDetail {
  voyagesServices = inject(VoyagesServices);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  favorisService = inject(FavorisServices);
  reviewsService = inject(ReviewsServices);

  voyageId = this.route.snapshot.paramMap.get('id') ?? '';

  voyage = toSignal(
    this.voyagesServices.getVoyageById(this.voyageId),
    { initialValue: null }
  );

  reviews = signal<ReviewsResponse | null>(null);
  isReviewsLoading = signal(false);
  reviewsError = signal('');

  isSubmitting = signal(false);
  message = signal('');
  messageType = signal<'success' | 'error' | ''>('');

  ratingSteps: Array<1 | 2 | 3 | 4 | 5> = [1, 2, 3, 4, 5];

  reviewForm = this.fb.nonNullable.group({
    authorName: ['Anonyme', [Validators.required, Validators.minLength(1)]],
    rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
    title: ['', [Validators.required, Validators.minLength(1)]],
    comment: ['', [Validators.required, Validators.minLength(1)]],
  });

  hasImages = computed(() => {
    const v = this.voyage();
    return !!v && Array.isArray(v.imageUrls) && v.imageUrls.length > 0;
  });

  ngOnInit(): void {
    void this.loadReviews();
  }

  async loadReviews(): Promise<void> {
    if (!this.voyageId) {
      this.reviewsError.set('Identifiant du voyage introuvable.');
      return;
    }

    this.isReviewsLoading.set(true);
    this.reviewsError.set('');

    try {
      const response = await firstValueFrom(this.reviewsService.getVoyageReviews(this.voyageId));
      this.reviews.set(response);
    } catch {
      this.reviewsError.set('Impossible de charger les avis pour le moment.');
    } finally {
      this.isReviewsLoading.set(false);
    }
  }

  distributionPercent(star: 1 | 2 | 3 | 4 | 5): number {
    const stats = this.reviews()?.stats;
    if (!stats || stats.total === 0) return 0;
    return Math.round((stats.distribution[star] / stats.total) * 100);
  }

  async submitReview(): Promise<void> {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    if (!this.voyageId) {
      this.showMessage('error', 'Identifiant du voyage introuvable.');
      return;
    }

    if (this.isSubmitting()) return;
    this.isSubmitting.set(true);

    const payload = this.reviewForm.getRawValue();

    try {
      await firstValueFrom(this.reviewsService.createVoyageReview(this.voyageId, payload));
      this.showMessage('success', 'Avis envoyé avec succès.');
      this.reviewForm.reset({
        authorName: 'Anonyme',
        rating: 0,
        title: '',
        comment: '',
      });
      await this.loadReviews();
    } catch {
      this.showMessage('error', "Erreur lors de l'envoi de l'avis.");
    } finally {
      this.isSubmitting.set(false);
    }
  }

  showMessage(type: 'success' | 'error', text: string): void {
    this.messageType.set(type);
    this.message.set(text);

    setTimeout(() => {
      this.message.set('');
      this.messageType.set('');
    }, 3000);
  }

  toggleFavorite(id: string): void {
    this.favorisService.toggleFavorite(id);
  }

  isFavorite(id: string): boolean {
    return this.favorisService.isFavorite(id);
  }

  trackByReviewId(index: number, item: { id: string }): string {
    return item.id;
  }

  formatDate(value: string): string {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString('fr-FR');
  }
}

