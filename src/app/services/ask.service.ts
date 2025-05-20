// src/app/services/openai.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface AskRequest {
  prompt: string;
}

interface AskResponse {
  response: string;
}

@Injectable({
  providedIn: 'root',
})
export class OpenaiService {
  private baseUrl = 'http://localhost:3333'; // URL do seu backend

  constructor(private http: HttpClient) {}

  ask(prompt: string): Observable<AskResponse> {
    return this.http.post<AskResponse>(`${this.baseUrl}/ask`, { prompt });
  }
}
