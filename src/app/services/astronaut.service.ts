import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetAstronautsResponse } from '../models/astronauts.model';

@Injectable({
  providedIn: 'root'
})
export class AstronautService {

  private apiUrl = 'https://orbital-external-requests.onrender.com';

  constructor(private http: HttpClient) { }

  getAstronauts(): Observable<GetAstronautsResponse> {
    return this.http.get<GetAstronautsResponse>(`${this.apiUrl}/astronauts`);
  }
}
