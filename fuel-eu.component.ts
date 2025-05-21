import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-fuel-eu',
  templateUrl: './fuel-eu.component.html',
  styleUrls: ['./fuel-eu.component.scss'],
  imports: [MatIconModule],
})
export class FuelEuComponent implements OnInit {
  ghgIntensity: number = 0.0;
  eligibleFuel: number = 0.0;
  penalty: number = 0.0;
  complianceBalance: number = 0.0;

  constructor() {}

  ngOnInit(): void {
    this.ghgIntensity = 91.5;
    this.eligibleFuel = 213.7;
    this.penalty = 12_450.0;
    this.complianceBalance = -83.2;
  }
}
