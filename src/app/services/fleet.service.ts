import { HttpHeaders } from '@angular/common/http';
import { inject, Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FleetService {
  apiUrl: any;
  private http = inject(HttpClient);
  constructor() {}

  getVesselAisData(): Observable<any> {
    this.apiUrl = 'https://api.cyberwaves.eu/v3/ais/getall'; // Replace with your actual API URL
    return this.http.get<any>(this.apiUrl);
  }
}
