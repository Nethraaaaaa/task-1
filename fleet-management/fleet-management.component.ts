import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

interface Vessel {
  id: number;
  name: string;
  imo: string;
  co2: string;
  co2Value: number; // For sorting purposes
  eua: string;
  euaValue: number; // For sorting purposes
  cii: string;
  voyages: number;
  category: string;
  year: string;
  currentPort: string;
  arrival: string;
  atd: string;
}

@Component({
  selector: 'app-fleet-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
  ],
  templateUrl: './fleet-management.component.html',
  styleUrls: ['./fleet-management.component.scss'],
})
export class FleetManagementComponent implements OnInit, AfterViewInit {
  // Filters
  years: string[] = ['2024', '2023', '2022', '2021'];
  selectedYear: string = '2024';
  selectedCategory: string = 'All';
  searchQuery: string = '';

  // Table setup
  displayedColumns: string[] = [
    'vessel',
    'co2',
    'eua',
    'cii',
    'voyages',
    'currentPort',
    'arrival',
    'atd',
  ];
  vessels: Vessel[] = [];
  dataSource!: MatTableDataSource<Vessel>;
  filteredVessels: Vessel[] = [];

  // Pagination
  pageSize: number = 10;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadVesselData();
    this.dataSource = new MatTableDataSource<Vessel>(this.vessels);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Set up custom filter predicate
    this.dataSource.filterPredicate = (
      data: Vessel,
      filter: string
    ): boolean => {
      const searchTerms = filter.trim().toLowerCase();

      return (
        data.name.toLowerCase().includes(searchTerms) ||
        data.imo.includes(searchTerms) ||
        data.co2.toLowerCase().includes(searchTerms) ||
        data.eua.toLowerCase().includes(searchTerms) ||
        data.cii.toLowerCase().includes(searchTerms) ||
        data.voyages.toString().includes(searchTerms)
      );
    };
  }

  loadVesselData(): void {
    // Simulating API data load
    this.vessels = [
      {
        id: 1,
        name: 'KRISTA',
        imo: '9086734',
        co2: '0.00 mt',
        co2Value: 0,
        eua: '10.60 EUA',
        euaValue: 10.6,
        cii: 'A',
        voyages: 10,
        category: 'Bulk',
        year: '2024',
        currentPort: 'Hamburg',
        arrival: '2024-05-10 14:30',
        atd: '2024-05-08 06:45',
      },
      {
        id: 5,
        name: 'KRISTA',
        imo: '9086734',
        co2: '0.00 mt',
        co2Value: 0,
        eua: '10.60 EUA',
        euaValue: 10.6,
        cii: 'A',
        voyages: 10,
        category: 'Container',
        year: '2024',
        currentPort: 'Rotterdam',
        arrival: '2024-05-12 16:20',
        atd: '2024-05-10 09:10',
      },
      {
        id: 7,
        name: 'OCEANIC STAR',
        imo: '9124567',
        co2: '2.45 mt',
        co2Value: 2.45,
        eua: '15.80 EUA',
        euaValue: 15.8,
        cii: 'C',
        voyages: 12,
        category: 'Container',
        year: '2023',
        currentPort: 'Singapore',
        arrival: '2023-11-15 10:00',
        atd: '2023-11-12 07:45',
      },
      {
        id: 8,
        name: 'NORTHERN LIGHT',
        imo: '9187654',
        co2: '3.78 mt',
        co2Value: 3.78,
        eua: '18.40 EUA',
        euaValue: 18.4,
        cii: 'B',
        voyages: 9,
        category: 'Bulk',
        year: '2023',
        currentPort: 'Shanghai',
        arrival: '2023-12-01 18:15',
        atd: '2023-11-28 06:00',
      },
      {
        id: 9,
        name: 'PACIFIC EXPLORER',
        imo: '9256789',
        co2: '0.95 mt',
        co2Value: 0.95,
        eua: '9.75 EUA',
        euaValue: 9.75,
        cii: 'A',
        voyages: 15,
        category: 'Tanker',
        year: '2023',
        currentPort: 'Los Angeles',
        arrival: '2023-10-10 20:45',
        atd: '2023-10-07 04:30',
      },
    ];

    // Set initial filtered vessels
    this.filteredVessels = this.vessels.filter(
      (vessel) => vessel.year === this.selectedYear
    );

    // Update data source
    if (this.dataSource) {
      this.dataSource.data = this.filteredVessels;
    }
  }

  applyFilters(): void {
    // First filter by category and year
    this.filteredVessels = this.vessels.filter((vessel) => {
      // Filter by year
      const yearMatch = vessel.year === this.selectedYear;

      // Filter by category (if not "All")
      const categoryMatch =
        this.selectedCategory === 'All' ||
        vessel.category === this.selectedCategory;

      return yearMatch && categoryMatch;
    });

    // Update the data source with filtered vessels
    this.dataSource.data = this.filteredVessels;

    // Then apply text search if there is any
    if (this.searchQuery) {
      this.dataSource.filter = this.searchQuery.trim().toLowerCase();
    } else {
      this.dataSource.filter = '';
    }

    // Reset to first page when filter changes
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  sortData(sort: Sort): void {
    const data = this.filteredVessels.slice();

    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'vessel':
          return this.compare(a.name, b.name, isAsc);
        case 'co2':
          return this.compare(a.co2Value, b.co2Value, isAsc);
        case 'eua':
          return this.compare(a.euaValue, b.euaValue, isAsc);
        case 'cii':
          return this.compare(a.cii, b.cii, isAsc);
        case 'voyages':
          return this.compare(a.voyages, b.voyages, isAsc);
        default:
          return 0;
      }
    });
  }

  pageChanged(event: PageEvent): void {
    this.pageSize = event.pageSize;
  }

  private compare(
    a: number | string,
    b: number | string,
    isAsc: boolean
  ): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
