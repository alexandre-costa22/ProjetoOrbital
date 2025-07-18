import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WikipediaService {
  private apiUrl = 'https://en.wikipedia.org/w/api.php';

  constructor(private http: HttpClient) {}

  buscarWikitexto(titulo: string): Observable<string> {
    const params = new HttpParams()
      .set('action', 'query')
      .set('prop', 'revisions')
      .set('rvprop', 'content')
      .set('rvslots', 'main')
      .set('format', 'json')
      .set('origin', '*')
      .set('titles', titulo);

    return new Observable<string>((observer) => {
      this.http.get<any>(this.apiUrl, { params }).subscribe({
        next: (res) => {
          let page: any = Object.values(res.query.pages)[0];
          const content = page.revisions[0].slots.main['*'];
          observer.next(content);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }
}
