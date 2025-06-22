import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, switchMap } from 'rxjs';
import { Expeditions } from '../models/expeditions.model';
import { of } from 'rxjs';

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
    const trySearch = (query: string) => {
      const url = `${this.baseUrl}?q=${encodeURIComponent(query)}&media_type=image`;
      return this.http.get<any>(url).pipe(
        map(res => {
          const items = res.collection?.items || [];
  
          // Prioriza imagens com palavras-chave relevantes
          const preferred = items.find((item: any) =>
            ['crew', 'portrait', 'official'].some(keyword =>
              item.data?.[0]?.title?.toLowerCase().includes(keyword)
            ) && item.links?.[0]?.href
          );
  
          if (preferred) return preferred.links[0].href;
  
          // Tenta pegar qualquer imagem da missão, exceto patches/logos
          const fallback = items.find((item: any) =>
            item.links?.[0]?.href &&
            !['patch', 'logo', 'insignia'].some(exclude =>
              item.data?.[0]?.title?.toLowerCase().includes(exclude)
            )
          );
  
          return fallback?.links?.[0]?.href || null;
        }),
        catchError(() => of(null))
      );
    };
  
    return trySearch(`${expeditionName} crew portrait`).pipe(
      switchMap(result => result ? of(result) : trySearch(`${expeditionName} mission`)),
      switchMap(result => result ? of(result) : trySearch(`${expeditionName} ISS`)),
      switchMap(result => result ? of(result) : trySearch(`${expeditionName} astronauts`)),
      catchError(() => of(null))
    );
  }
  
}
