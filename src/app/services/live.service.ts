import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LiveService {
  private apiUrl = 'https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=5';

  constructor(private http: HttpClient) {}

  getUpcomingLaunches(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response.results)
    );
  }
}
