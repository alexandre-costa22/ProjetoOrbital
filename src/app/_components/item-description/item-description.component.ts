import { Component } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { EnvironmentConfiguration } from '../../key/apiKey';
import { ActivatedRoute } from '@angular/router';
import { marked } from 'marked';

@Component({
  selector: 'app-item-description',
  templateUrl: './item-description.component.html',
  styleUrl: './item-description.component.css',
  standalone: false
})
export class ItemDescriptionComponent {

  name: string = '';
  description: any;
  genAI = new GoogleGenerativeAI(EnvironmentConfiguration.apiKey);
  model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


  constructor(
    private route: ActivatedRoute
  ) { 
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.name = params.get('name') ?? '';
    });
    this.run('Utilizando fontes confiáveis e de forma didática, me retorne uma descrição detalhada de ' + this.name + ', realizada com o apoio da NASA. Cite os seguintes tópicos: Objetivo(s) principal(ais), data de inicio e término da missão, curiosidades e fontes. Cite as fontes que utilizou no fim da resposta. Por favor, retorne a resposta formatada em Markdown');
  }

  share() {
    alert('Compartilhado com sucesso!');
  }

  async run(prompt: string) {
    const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt + "\n\nPor favor, formate o conteúdo em Markdown.");
    const response = await result.response;
    const text = response.text();
    this.description = marked(text);
  }
}
