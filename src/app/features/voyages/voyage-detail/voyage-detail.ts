import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { Header } from "../../../shared/header/header";
import { Footer } from "../../../shared/footer/footer";
import { VoyagesServices } from '../../../core/voyagesServices/voyages.services';
import { ReviewsServices } from '../../../core/reviewsServices/reviews.services';
import { ReviewsResponse } from '../../../core/models/reviewsResponse.model';
import { Voyage } from '../../../core/models/voyage.model';
import { FavorisServices } from '../../../core/favorisServices/favoris.services';

@Component({
  selector: 'app-voyage-detail',
  imports: [Header, Footer, RouterLink, DatePipe, ReactiveFormsModule],
  templateUrl: './voyage-detail.html',
  styleUrl: './voyage-detail.css',
})
export class VoyageDetail {
  voyagesServices = inject(VoyagesServices);
  reviewsServices = inject(ReviewsServices);
  favorisService = inject(FavorisServices);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);

  voyageId = this.route.snapshot.paramMap.get('id') || '';

  stars = [1, 2, 3, 4, 5];

  voyage = signal<Voyage | null>(null);
  isVoyageLoading = signal<boolean>(true);
  voyageError = signal<string>('');

  reviewsResponse = signal<ReviewsResponse | null>(null);
  isReviewsLoading = signal<boolean>(true);
  reviewsError = signal<string>('');

  submittingReview = signal<boolean>(false);
  currentImageIndex = signal<number>(0);

  toast = signal<{ type: 'success' | 'error'; message: string } | null>(null);
  toastTimer: ReturnType<typeof setTimeout> | null = null;

  reviewForm = this.fb.nonNullable.group({
    authorName: ['', [Validators.required, Validators.minLength(1)]],
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    title: ['', [Validators.required, Validators.minLength(1)]],
    comment: ['', [Validators.required, Validators.minLength(1)]],
  });

  constructor() {
    void this.loadVoyage();
    void this.loadReviews();
  }

  async loadVoyage(): Promise<void> {
    if (!this.voyageId) {
      this.voyageError.set('Voyage introuvable.');
      this.isVoyageLoading.set(false);
      return;
    }

    this.isVoyageLoading.set(true);
    this.voyageError.set('');

    try {
      const voyageData = await firstValueFrom(this.voyagesServices.getVoyageById(this.voyageId));
      this.voyage.set(voyageData);
      this.currentImageIndex.set(0);
    } catch {
      this.voyageError.set('Impossible de charger les informations du voyage.');
    } finally {
      this.isVoyageLoading.set(false);
    }
  }

  async loadReviews(): Promise<void> {
    if (!this.voyageId) {
      this.reviewsError.set('Voyage introuvable.');
      this.isReviewsLoading.set(false);
      return;
    }

    this.isReviewsLoading.set(true);
    this.reviewsError.set('');

    try {
      const response = await firstValueFrom(this.reviewsServices.getVoyageReviews(this.voyageId));
      this.reviewsResponse.set(response);
    } catch {
      this.reviewsError.set('Impossible de charger les avis.');
    } finally {
      this.isReviewsLoading.set(false);
    }
  }

  images(): string[] {
    return this.voyage()?.imageUrls ?? [];
  }

  previousImage(): void {
    const images = this.images();
    if (images.length === 0) return;
    const previous =
      this.currentImageIndex() === 0
        ? images.length - 1
        : this.currentImageIndex() - 1;
    this.currentImageIndex.set(previous);
  }

  nextImage(): void {
    const images = this.images();
    if (images.length === 0) return;
    const next =
      this.currentImageIndex() === images.length - 1
        ? 0
        : this.currentImageIndex() + 1;
    this.currentImageIndex.set(next);
  }

  goToImage(index: number): void {
    this.currentImageIndex.set(index);
  }

  roundedRating(value: number): number {
    return Math.round(value);
  }

  distributionRows(): Array<{ star: number; count: number }> {
    const distribution = this.reviewsResponse()?.stats.distribution;
    return this.stars.map((star) => ({
      star,
      count: distribution?.[star as 1 | 2 | 3 | 4 | 5] ?? 0,
    }));
  }

  getDistributionWidth(count: number): string {
    const maxCount = Math.max(...this.distributionRows().map((row) => row.count), 1);
    const width = (count / maxCount) * 100;
    return `${width}%`;
  }

  setRating(value: number): void {
    this.reviewForm.controls.rating.setValue(value);
    this.reviewForm.controls.rating.markAsTouched();
  }

  showFieldError(controlName: 'authorName' | 'rating' | 'title' | 'comment'): boolean {
    const control = this.reviewForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  async submitReview(): Promise<void> {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    this.submittingReview.set(true);

    const payload = this.reviewForm.getRawValue();

    try {
      await firstValueFrom(this.reviewsServices.createVoyageReview(this.voyageId, payload));
      this.showToast('Avis publié avec succès.', 'success');
      this.reviewForm.reset({
        authorName: '',
        rating: 5,
        title: '',
        comment: '',
      });
      await this.loadReviews();
    } catch {
      this.showToast("Erreur lors de l'envoi de l'avis.", 'error');
    } finally {
      this.submittingReview.set(false);
    }
  }

  showToast(message: string, type: 'success' | 'error'): void {
    this.toast.set({ message, type });

    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }

    this.toastTimer = setTimeout(() => {
      this.toast.set(null);
      this.toastTimer = null;
    }, 3500);
  }

  toggleFavorite(id: string): void {
    this.favorisService.toggleFavorite(id);
  }

  isFavorite(id: string): boolean {
    return this.favorisService.isFavorite(id);
  }
}

