import {
  Component,
  OnInit,
  ElementRef,
  inject,
  OnDestroy,
} from '@angular/core';
import { FleetMapComponent } from '../fleet-map/fleet-map.component';
import { FleetManagementComponent } from '../fleet-management/fleet-management.component';
import { FuelEuComponent } from '../fuel-eu/fuel-eu.component';
import { EmissionsComponent } from '../emissions/emissions.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FleetMapComponent,
    FuelEuComponent,
    FleetManagementComponent,
    EmissionsComponent,
    FormsModule,
    MatIconModule,
    NgFor,
    NgIf,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  searchText: string = '';
  availableYears: number[] = [];
  selectedYear: number = new Date().getFullYear();

  isDropdownOpen: boolean = false;
  vesselNames: string[] = [
    'Pacific Voyager',
    'Atlantic Explorer',
    'Nordic Star',
    'Ocean Pioneer',
    'Mediterranean Queen',
    'Baltic Trader',
    'Arctic Navigator',
    'Southern Cross',
    'Eastern Wind',
    'Western Horizon',
  ];
  private elementRef = inject(ElementRef);

  // This will be used to filter vessel names
  get filteredVesselNames(): string[] {
    return this.vesselNames.filter((vessel) =>
      vessel.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  ngOnInit(): void {
    this.availableYears = Array.from(
      { length: 2025 - 2000 + 1 },
      (_, i) => 2025 - i
    );

    document.addEventListener('click', this.handleDocumentClick);
  }

  ngOnDestroy(): void {
    // Clean up the event listener when component is destroyed
    document.removeEventListener('click', this.handleDocumentClick);
  }
  private handleDocumentClick = (event: Event): void => {
    const targetElement = event.target as HTMLElement;
    // Use arrow function to maintain correct 'this' context
    if (
      targetElement.tagName === 'INPUT' &&
      targetElement.getAttribute('placeholder') === 'Fleet Overview'
    ) {
      return;
    }
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  };

  // When a vessel is selected from dropdown
  selectVessel(vessel: string): void {
    this.searchText = vessel;
    this.isDropdownOpen = false;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
