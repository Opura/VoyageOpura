import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';

import * as L from 'leaflet';

import { Header } from '../../../shared/header/header';
import { Footer } from '../../../shared/footer/footer';
import { DestinationsServices } from '../../../core/destinationsServices/destinations.services';
import { Destination } from '../../../core/models/destination.model';
import { Hotel } from '../../../core/models/hotel.model';
import { Activity } from '../../../core/models/activity.model';

@Component({
  selector: 'app-destination-detail',
  imports: [Header, Footer, RouterLink, CommonModule],
  templateUrl: './destination-detail.html',
  styleUrl: './destination-detail.css',
})
export class DestinationDetail implements AfterViewInit, OnDestroy {
  private destinationsServices = inject(DestinationsServices);
  private route = inject(ActivatedRoute);

  destinationId = this.route.snapshot.paramMap.get('id') ?? '';

  destination = toSignal<Destination | null>(
    this.destinationsServices.getDestinationById(this.destinationId).pipe(
      catchError(() => of(null))
    ),
    { initialValue: null }
  );

  hotels = computed<Hotel[]>(() => this.destination()?.hotels ?? []);
  activities = computed<Activity[]>(() => this.destination()?.activities ?? []);

  @ViewChild('mapContainer') mapContainer?: ElementRef<HTMLDivElement>;
  private map: L.Map | null = null;
  private destinationMarker: L.Marker | null = null;
  private hotelMarkers: L.Marker[] = [];
  private mapReady = false;

  constructor() {
    effect(() => {
      const d = this.destination();
      if (!d || !this.mapReady) return;
      this.renderMap(d);
    });
  }

  ngAfterViewInit(): void {
    this.mapReady = true;
    const d = this.destination();
    if (d) this.renderMap(d);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  private renderMap(d: Destination): void {
    if (!this.mapContainer) return;

    const lat = d.latitude;
    const lng = d.longitude;

    if (!this.map) {
      this.map = L.map(this.mapContainer.nativeElement, {
        center: [lat, lng],
        zoom: 8,
        scrollWheelZoom: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(this.map);
    } else {
      this.map.setView([lat, lng], 8);
    }

    if (this.destinationMarker) {
      this.destinationMarker.remove();
    }

    this.destinationMarker = L.marker([lat, lng])
      .addTo(this.map)
      .bindPopup('<strong>' + d.name + '</strong>')
      .openPopup();

    this.hotelMarkers.forEach((m) => m.remove());
    this.hotelMarkers = [];

    this.hotels().forEach((h) => {
      if (h.latitude == null || h.longitude == null) return;
      const marker = L.marker([h.latitude, h.longitude])
        .addTo(this.map!)
        .bindPopup(h.name);
      this.hotelMarkers.push(marker);
    });
  }
}
