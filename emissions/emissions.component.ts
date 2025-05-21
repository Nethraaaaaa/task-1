import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-emissions',
  standalone: true,
  imports: [NgFor, MatIconModule],
  templateUrl: './emissions.component.html',
  styleUrls: ['./emissions.component.scss'],
})
export class EmissionsComponent {
  fleetData = [
    {
      fleetName: 'CyberSmart AI Fleet',
      CO2Emitted: 111.63,
      EUARequired: 100.64,
      CH4Emitted: 0.0,
      N2OEmitted: 0.0,
    },
  ];

  fleetComplianceData = [
    {
      fleetId: 'Fleet 1',
      EEOI: 10.63,
      AER: 10.63,
    },
  ];
}
