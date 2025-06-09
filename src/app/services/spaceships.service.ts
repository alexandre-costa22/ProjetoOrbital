import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { Spaceships } from '../models/spaceshps.model';

interface NasaItem {
  data?: { title?: string }[];
  links?: { href: string }[];
}

@Injectable({
  providedIn: 'root'
})

export class SpaceshipsService {

  private apiUrl = 'http://localhost:3333/spaceships';
  private baseUrl = 'https://images-api.nasa.gov/search';

  constructor(private http: HttpClient) {}

  getSpaceships(): Observable<Spaceships[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response.expeditions) 
    );
  }

  getSpaceshipPhotos(expeditionName: string): Observable<string[]> {
    const trySearch = (query: string) => {
      const url = `${this.baseUrl}?q=${encodeURIComponent(query)}&media_type=image`;
      return this.http.get<any>(url).pipe(
        map(res => {
          const items: NasaItem[] = res.collection?.items || [];
          const filtered = items.filter((item: NasaItem) => {
            const title = item.data?.[0]?.title?.toLowerCase() || '';
            const href = item.links?.[0]?.href || null;
            if (!href) return false;
            if (['patch', 'logo', 'insignia', 'portrait', 'crew', 'official'].some(exclude => title.includes(exclude))) {
              return false;
            }
            return ['spaceship', 'ship', 'spacecraft', 'mission', 'expedition', 'iss', 'rocket', 'vehicle'].some(include =>
              title.includes(include)
            );
          });
  
          return filtered.slice(0, 5).map((item: NasaItem) => item.links![0].href);
        }),
        catchError(() => of([]))
      );
    };
  
    return trySearch(`${expeditionName} spaceship`).pipe(
      switchMap(results => results.length ? of(results) : trySearch(`${expeditionName} mission`)),
      switchMap(results => results.length ? of(results) : trySearch(`${expeditionName} rocket`)),
      catchError(() => of([]))
    );
  }
  
  
}
