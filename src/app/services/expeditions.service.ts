import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Expeditions } from '../models/expeditions.model';

@Injectable({
  providedIn: 'root'
})
export class ExpeditionService {

  private apiUrl = 'http://localhost:3333/expeditions';
  private baseUrl = 'https://images-api.nasa.gov/search';

  constructor(private http: HttpClient) {}

  getExpeditions(): Observable<Expeditions[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response.expeditions) 
    );
  }

  getCrewPhoto(expeditionName: string): Observable<string | null> {
    const query = `${this.baseUrl}?q=${encodeURIComponent(expeditionName + ' crew portrait')}&media_type=image`;
    return this.http.get<any>(query).pipe(
      map(res => {
        const items = res.collection?.items || [];
        const crewImage = items.find((item: any) =>
          item.data?.[0]?.title?.toLowerCase().includes('crew') &&
          item.links?.[0]?.href
        );
        return crewImage?.links?.[0]?.href || null;
      })
    );
  }
  
}
