import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetSpaceshipsResponse } from '../models/spacecraft.model';

@Injectable({
  providedIn: 'root'
})
export class SpacecraftService {

  private apiUrl = 'http://orbital-external-requests.onrender.com';

  constructor(private http: HttpClient) { }

  getSpaceships(): Observable<GetSpaceshipsResponse> {
    return this.http.get<GetSpaceshipsResponse>(`${this.apiUrl}/spaceships`);
  }
}
