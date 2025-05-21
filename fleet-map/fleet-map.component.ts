// import {
//   Component,
//   OnInit,
//   ViewChild,
//   ElementRef,
//   AfterViewInit,
//   OnDestroy,
//   inject,
// } from '@angular/core';
// import { Map, MapStyle, config, Popup, LngLatBounds } from '@maptiler/sdk';
// import '@maptiler/sdk/dist/maptiler-sdk.css';
// import { FleetService } from '../../services/fleet.service';

// @Component({
//   selector: 'app-fleet-map',
//   templateUrl: './fleet-map.component.html',
//   styleUrls: ['./fleet-map.component.scss'],
// })
// export class FleetMapComponent implements OnInit, AfterViewInit, OnDestroy {
//   map: Map | undefined;
//   @ViewChild('map', { static: true })
//   private mapContainer!: ElementRef<HTMLElement>;
//   private fleetService = inject(FleetService);

//   aisData: any[] = [];
//   vesselPositionData: any[] = [];

//   ngOnInit(): void {
//     config.apiKey = 'wNgThZLeFI4Idl8bpslM';
//     console.log('Fleet Map Component Initialized');
//     this.fleetService.getVesselAisData().subscribe((data) => {
//       this.aisData = data;
//       console.log('Vessel AIS Data:', this.aisData);
//     });
//   }

//   ngAfterViewInit(): void {
//     const vesselIcon = new Image();
//     vesselIcon.src = 'assets/images/vessel.svg';
//     vesselIcon.width = 32;
//     vesselIcon.height = 32;

//     vesselIcon.onload = () => {
//       this.map = new Map({
//         container: this.mapContainer.nativeElement,
//         style:
//           'https://api.maptiler.com/maps/0196ed3c-8427-7690-bbfe-60060cd3c7b3/style.json?key=wNgThZLeFI4Idl8bpslM',
//         center: [-90, 20],
//         zoom: 3,
//         hash: true,
//         maptilerLogo: false,
//         navigationControl: true,
//         terrainControl: false,
//         geolocateControl: false,
//         scaleControl: false,
//         fullscreenControl: true,
//         attributionControl: false,
//       });

//       this.map.on('load', () => {
//         if (!this.map?.hasImage('vessel-icon')) {
//           this.map?.addImage('vessel-icon', vesselIcon, { sdf: false });
//         }

//         this.vesselPositionData = this.aisData;
//         this.updateShipMarkers();
//       });
//     };

//     vesselIcon.onerror = (err) => {
//       console.error('Failed to load vessel icon image:', err);
//     };
//   }

//   ngOnDestroy(): void {
//     this.map?.remove();
//   }

//   updateShipMarkers(): void {
//     if (!this.map || !this.vesselPositionData.length) return;

//     this.clearShipMarkers();

//     const geoJsonData: any = {
//       type: 'FeatureCollection',
//       features: this.vesselPositionData.map((ship: any, index: number) => ({
//         id: index + 1,
//         type: 'Feature',
//         geometry: {
//           type: 'Point',
//           coordinates: [ship.lon, ship.lat],
//         },
//         properties: {
//           name: ship.vesselName,
//           destination: ship.finalDestination || 'Unknown',
//         },
//       })),
//     };

//     this.map.addSource('shipsSource', {
//       type: 'geojson',
//       data: geoJsonData,
//       cluster: false,
//     });

//     this.map.addLayer({
//       id: 'shipMarkers',
//       type: 'symbol',
//       source: 'shipsSource',
//       layout: {
//         'icon-image': 'vessel-icon',
//         'icon-size': [
//           'interpolate',
//           ['linear'],
//           ['zoom'],
//           0,
//           0.7,
//           10,
//           1,
//           22,
//           1.5,
//         ],
//         'icon-allow-overlap': true,
//         'text-allow-overlap': true,
//         'icon-offset': [0, -10], // tweak to align icon base with coordinates
//       },
//       paint: {
//         'icon-opacity': [
//           'case',
//           ['boolean', ['feature-state', 'overlap'], false],
//           0.5,
//           1.0,
//         ],
//       },
//     });

//     this.map.addLayer({
//       id: 'hoverCircle',
//       type: 'circle',
//       source: 'shipsSource',
//       paint: {
//         'circle-radius': 100,
//         'circle-color': '#FFFFFF',
//         'circle-stroke-opacity': 0.6,
//       },
//       filter: ['==', 'id', ''],
//     });

//     const bounds = new LngLatBounds();
//     geoJsonData.features.forEach((feature: any) => {
//       bounds.extend(feature.geometry.coordinates);
//     });

//     if (geoJsonData.features.length === 1) {
//       this.map.flyTo({
//         center: geoJsonData.features[0].geometry.coordinates,
//         zoom: 5,
//       });
//     } else {
//       this.map.fitBounds(bounds, { padding: 50, maxZoom: 15 });
//     }

//     let popup: Popup | null = null;

//     this.map.on('click', 'shipMarkers', (e: any) => {
//       const coordinates = e.features[0].geometry.coordinates.slice();
//       const { name, destination } = e.features[0].properties;
//       if (popup) popup.remove();

//       popup = new Popup({ closeButton: true, closeOnClick: true })
//         .setLngLat(coordinates)
//         .setHTML(
//           `<strong>Vessel Name:</strong> ${name}<br><strong>Destination:</strong> ${destination}`
//         )
//         .addTo(this.map!);
//     });

//     this.map.on('mouseenter', 'shipMarkers', (e: any) => {
//       this.map!.getCanvas().style.cursor = 'pointer';
//       const coordinates = e.features[0].geometry.coordinates.slice();
//       const { name, destination } = e.features[0].properties;

//       this.map!.setFilter('hoverCircle', ['==', 'id', e.features[0].id]);

//       if (popup) popup.remove();
//       popup = new Popup({ closeButton: false, closeOnClick: false })
//         .setLngLat(coordinates)
//         .setHTML(
//           `<strong>Vessel Name:</strong> ${name}<br><strong>Destination:</strong> ${destination}`
//         )
//         .addTo(this.map!);
//     });

//     this.map.on('mouseleave', 'shipMarkers', () => {
//       this.map!.getCanvas().style.cursor = '';
//       this.map!.setFilter('hoverCircle', ['==', 'id', '']);
//       if (popup) popup.remove();
//     });

//     this.map.on('moveend', () => {
//       const features: any = this.map!.queryRenderedFeatures({
//         layers: ['shipMarkers'],
//       });
//       features.forEach((feature: any) => {
//         this.map!.setFeatureState(
//           { source: 'shipsSource', id: feature.id },
//           { overlap: false }
//         );
//       });

//       for (let i = 0; i < features.length; i++) {
//         for (let j = i + 1; j < features.length; j++) {
//           const f1 = features[i].geometry.coordinates;
//           const f2 = features[j].geometry.coordinates;
//           if (this.areMarkersOverlapping(f1, f2)) {
//             this.map!.setFeatureState(
//               { source: 'shipsSource', id: features[i].id },
//               { overlap: true }
//             );
//             this.map!.setFeatureState(
//               { source: 'shipsSource', id: features[j].id },
//               { overlap: true }
//             );
//           }
//         }
//       }
//     });
//   }

//   areMarkersOverlapping(
//     coord1: [number, number],
//     coord2: [number, number]
//   ): boolean {
//     const distance = Math.sqrt(
//       Math.pow(coord1[0] - coord2[0], 2) + Math.pow(coord1[1] - coord2[1], 2)
//     );
//     return distance < 0.01;
//   }

//   clearShipMarkers(): void {
//     if (!this.map) return;
//     if (this.map.getLayer('shipMarkers')) this.map.removeLayer('shipMarkers');
//     if (this.map.getLayer('hoverCircle')) this.map.removeLayer('hoverCircle');
//     if (this.map.getSource('shipsSource')) this.map.removeSource('shipsSource');
//   }
// }

import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { Map, MapStyle, config, Popup, LngLatBounds } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { FleetService } from '../../services/fleet.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-fleet-map',
  templateUrl: './fleet-map.component.html',
  styleUrls: ['./fleet-map.component.scss'],
  imports: [NgIf],
})
export class FleetMapComponent implements OnInit, AfterViewInit, OnDestroy {
  map: Map | undefined;
  @ViewChild('map', { static: true })
  private mapContainer!: ElementRef<HTMLElement>;
  private fleetService = inject(FleetService);
  private cdr = inject(ChangeDetectorRef);

  aisData: any[] = [];
  vesselPositionData: any[] = [];

  // Add properties for the side panel
  selectedVessel: any = null;
  showSidePanel = false;

  ngOnInit(): void {
    config.apiKey = 'wNgThZLeFI4Idl8bpslM';
    console.log('Fleet Map Component Initialized');
    this.fleetService.getVesselAisData().subscribe((data) => {
      this.aisData = data;
      console.log('Vessel AIS Data:', this.aisData);
    });
  }

  ngAfterViewInit(): void {
    const vesselIcon = new Image();
    vesselIcon.src = 'assets/images/vessel.svg';
    vesselIcon.width = 32;
    vesselIcon.height = 32;

    vesselIcon.onload = () => {
      this.map = new Map({
        container: this.mapContainer.nativeElement,
        style:
          'https://api.maptiler.com/maps/0196ed3c-8427-7690-bbfe-60060cd3c7b3/style.json?key=wNgThZLeFI4Idl8bpslM',
        center: [-90, 20],
        zoom: 3,
        hash: true,
        maptilerLogo: false,
        navigationControl: true,
        terrainControl: false,
        geolocateControl: false,
        scaleControl: false,
        fullscreenControl: true,
        attributionControl: false,
      });

      this.map.on('load', () => {
        if (!this.map?.hasImage('vessel-icon')) {
          this.map?.addImage('vessel-icon', vesselIcon, { sdf: false });
        }

        this.vesselPositionData = this.aisData;
        this.updateShipMarkers();
      });
    };

    vesselIcon.onerror = (err) => {
      console.error('Failed to load vessel icon image:', err);
    };
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  updateShipMarkers(): void {
    if (!this.map || !this.vesselPositionData.length) return;

    this.clearShipMarkers();

    const geoJsonData: any = {
      type: 'FeatureCollection',
      features: this.vesselPositionData.map((ship: any, index: number) => ({
        id: index + 1,
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [ship.lon, ship.lat],
        },
        properties: {
          name: ship.vesselName,
          destination: ship.finalDestination || 'Unknown',
          // Add the full ship object to properties for easy access
          vesselData: ship,
        },
      })),
    };

    this.map.addSource('shipsSource', {
      type: 'geojson',
      data: geoJsonData,
      cluster: false,
    });

    this.map.addLayer({
      id: 'shipMarkers',
      type: 'symbol',
      source: 'shipsSource',
      layout: {
        'icon-image': 'vessel-icon',
        'icon-size': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0,
          0.7,
          10,
          1,
          22,
          1.5,
        ],
        'icon-allow-overlap': true,
        'text-allow-overlap': true,
        'icon-offset': [0, -10], // tweak to align icon base with coordinates
      },
      paint: {
        'icon-opacity': [
          'case',
          ['boolean', ['feature-state', 'overlap'], false],
          0.5,
          1.0,
        ],
      },
    });

    this.map.addLayer({
      id: 'hoverCircle',
      type: 'circle',
      source: 'shipsSource',
      paint: {
        'circle-radius': 100,
        'circle-color': '#FFFFFF',
        'circle-stroke-opacity': 0.6,
      },
      filter: ['==', 'id', ''],
    });

    const bounds = new LngLatBounds();
    geoJsonData.features.forEach((feature: any) => {
      bounds.extend(feature.geometry.coordinates);
    });

    if (geoJsonData.features.length === 1) {
      this.map.flyTo({
        center: geoJsonData.features[0].geometry.coordinates,
        zoom: 5,
      });
    } else {
      this.map.fitBounds(bounds, { padding: 50, maxZoom: 15 });
    }

    let popup: Popup | null = null;

    this.map.on('click', 'shipMarkers', (e: any) => {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const properties = e.features[0].properties;

      // Close any existing popup
      if (popup) popup.remove();

      // Find the actual vessel data (using index if available)
      const vesselId = e.features[0].id;
      const vesselData =
        this.vesselPositionData.find((v, idx) => idx + 1 === vesselId) || {};

      // Set the selected vessel and show the side panel
      this.selectedVessel = {
        name: properties.name,
        destination: properties.destination,
        currentLocation: 'Baltic Sea', // This would come from your actual data
        coordinates: coordinates,
        eta: vesselData.eta || 'Unknown',
        // Add any other properties you want to display
      };

      this.showSidePanel = true;
      this.cdr.detectChanges(); // Ensure the panel is shown immediately

      // Highlight the selected vessel
      this.map!.setFilter('hoverCircle', ['==', 'id', e.features[0].id]);
    });

    this.map.on('mouseenter', 'shipMarkers', (e: any) => {
      this.map!.getCanvas().style.cursor = 'pointer';
      const coordinates = e.features[0].geometry.coordinates.slice();
      const { name, destination } = e.features[0].properties;

      this.map!.setFilter('hoverCircle', ['==', 'id', e.features[0].id]);

      if (popup) popup.remove();
      // Create a new popup with themed styling
      popup = new Popup({
        closeButton: false,
        closeOnClick: false,
        className: 'fleet-popup', // Add a custom class for styling if needed
      })
        .setLngLat(coordinates)
        .setHTML(
          `<strong>Vessel Name:</strong> ${name}<br><strong>Destination:</strong> ${destination}`
        )
        .addTo(this.map!);
    });

    this.map.on('mouseleave', 'shipMarkers', () => {
      this.map!.getCanvas().style.cursor = '';

      // Only clear the highlight if no vessel is selected
      if (!this.showSidePanel) {
        this.map!.setFilter('hoverCircle', ['==', 'id', '']);
      }

      if (popup) popup.remove();
    });

    this.map.on('moveend', () => {
      const features: any = this.map!.queryRenderedFeatures({
        layers: ['shipMarkers'],
      });
      features.forEach((feature: any) => {
        this.map!.setFeatureState(
          { source: 'shipsSource', id: feature.id },
          { overlap: false }
        );
      });

      for (let i = 0; i < features.length; i++) {
        for (let j = i + 1; j < features.length; j++) {
          const f1 = features[i].geometry.coordinates;
          const f2 = features[j].geometry.coordinates;
          if (this.areMarkersOverlapping(f1, f2)) {
            this.map!.setFeatureState(
              { source: 'shipsSource', id: features[i].id },
              { overlap: true }
            );
            this.map!.setFeatureState(
              { source: 'shipsSource', id: features[j].id },
              { overlap: true }
            );
          }
        }
      }
    });
  }

  areMarkersOverlapping(
    coord1: [number, number],
    coord2: [number, number]
  ): boolean {
    const distance = Math.sqrt(
      Math.pow(coord1[0] - coord2[0], 2) + Math.pow(coord1[1] - coord2[1], 2)
    );
    return distance < 0.01;
  }

  clearShipMarkers(): void {
    if (!this.map) return;
    if (this.map.getLayer('shipMarkers')) this.map.removeLayer('shipMarkers');
    if (this.map.getLayer('hoverCircle')) this.map.removeLayer('hoverCircle');
    if (this.map.getSource('shipsSource')) this.map.removeSource('shipsSource');
  }

  // Method to close the side panel
  closeSidePanel(): void {
    this.showSidePanel = false;
    this.selectedVessel = null;

    // Clear any vessel highlighting
    if (this.map) {
      this.map.setFilter('hoverCircle', ['==', 'id', '']);
    }

    this.cdr.detectChanges();
  }
}
