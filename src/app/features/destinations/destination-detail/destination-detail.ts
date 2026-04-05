import { Component, effect, inject, signal, ViewChild, ElementRef, EffectRef, OnDestroy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import type * as Leaflet from 'leaflet';

import { Header } from "../../../shared/header/header";
import { Footer } from "../../../shared/footer/footer";
import { DestinationsServices } from '../../../core/destinationsServices/destinations.services';
import { Destination } from '../../../core/models/destination.model';

@Component({
  selector: 'app-destination-detail',
  imports: [Header, Footer, RouterLink],
  templateUrl: './destination-detail.html',
  styleUrl: './destination-detail.css',
})
export class DestinationDetail implements OnDestroy {
  destinationsServices = inject(DestinationsServices);
  route = inject(ActivatedRoute);
  @ViewChild('destinationMap') mapContainer?: ElementRef<HTMLDivElement>;

  destinationId = this.route.snapshot.paramMap.get('id') || '';
  destinationError = signal<string>('');
  private leafletLib: typeof import('leaflet') | null = null;
  private map: Leaflet.Map | null = null;
  private destinationMarker: Leaflet.Marker | null = null;
  private hotelMarkers: Leaflet.Marker[] = [];
  private readonly mapEffectRef: EffectRef;

  destination = toSignal<Destination | null>(
    this.destinationId
      ? this.destinationsServices.getDestinationById(this.destinationId).pipe(
          catchError((error) => {
            console.error('Error loading destination detail:', error);
            this.destinationError.set('Impossible de charger les informations de cette destination.');
            return of(null);
          })
        )
      : of(null),
    { initialValue: null }
  );

  constructor() {
    this.mapEffectRef = effect(() => {
      const destination = this.destination();
      if (!destination || this.destinationError()) return;
      this.scheduleMapInitialization();
    });

    if (!this.destinationId) {
      this.destinationError.set('Destination introuvable.');
    }
  }

  ngOnDestroy(): void {
    this.mapEffectRef.destroy();
    this.hotelMarkers.forEach((marker) => marker.remove());
    this.hotelMarkers = [];
    this.destinationMarker?.remove();
    this.destinationMarker = null;
    this.map?.remove();
    this.map = null;
  }

  getHotelStars(stars: number): string {
    const boundedStars = Math.max(1, Math.min(5, Math.round(stars)));
    return '★'.repeat(boundedStars);
  }

  private scheduleMapInitialization(): void {
    requestAnimationFrame(() => {
      void this.initializeMap();
    });
  }

  private async initializeMap(): Promise<void> {
    const destination = this.destination();
    const container = this.mapContainer?.nativeElement;

    if (!destination || !container) {
      return;
    }

    if (!this.leafletLib) {
      this.leafletLib = await import('leaflet');
      this.configureLeafletDefaultIcon(this.leafletLib);
    }

    const L = this.leafletLib;

    if (!this.map) {
      this.map = L.map(container, {
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(this.map);
    }

    const center: Leaflet.LatLngTuple = [destination.latitude, destination.longitude];
    this.map.setView(center, 8);

    this.destinationMarker?.remove();
    this.destinationMarker = L.marker(center)
      .addTo(this.map)
      .bindPopup(`<strong>${destination.name}</strong>`)
      .openPopup();

    this.hotelMarkers.forEach((marker) => marker.remove());
    this.hotelMarkers = [];

    for (const hotel of destination.hotels) {
      if (!this.hasCoordinates(hotel.latitude, hotel.longitude)) {
        continue;
      }

      const marker = L.marker([hotel.latitude, hotel.longitude])
        .addTo(this.map)
        .bindPopup(`<strong>${hotel.name}</strong><br/>${hotel.stars}★ - ${hotel.pricePerNight}€/nuit`);

      this.hotelMarkers.push(marker);
    }

    setTimeout(() => {
      this.map?.invalidateSize();
    }, 0);
  }

  private configureLeafletDefaultIcon(L: typeof import('leaflet')): void {
    const defaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    L.Marker.prototype.options.icon = defaultIcon;
  }

  private hasCoordinates(latitude: number, longitude: number): boolean {
    return Number.isFinite(latitude) && Number.isFinite(longitude);
  }
}
