import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Expeditions } from '../models/expeditions.model';

@Injectable({
  providedIn: 'root'
})
export class ExpeditionService {

  private apiUrl = 'http://localhost:3333/expeditions';

  constructor(private http: HttpClient) {}

  getExpeditions(): Observable<Expeditions[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response.expeditions) // pegando o array
    );
  }
  
}
