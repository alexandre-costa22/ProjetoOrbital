// src/app/services/openai.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import OpenAI from 'openai';
import { Observable } from 'rxjs';
import { EnvironmentConfiguration } from '../key/apiKey';

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
  private openai: OpenAI;

  constructor(private http: HttpClient) { 
      this.openai = new OpenAI({
        apiKey: EnvironmentConfiguration.apiKey, 
        dangerouslyAllowBrowser: true
      });
    }

    async getCompletion(prompt: string, model: string = 'gpt-3.5-turbo') {
      try {
        const completion = await this.openai.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: model,
        });
        return completion.choices[0].message.content;
      } catch (error) {
        console.error('Error:', error);
        return null;
      }
    }
}
