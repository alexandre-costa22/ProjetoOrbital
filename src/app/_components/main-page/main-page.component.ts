import { Component, AfterViewInit  } from '@angular/core';
import { ExpeditionService } from '../../services/expeditions.service';
import { Expeditions } from '../../models/expeditions.model';
import { GoogleGenerativeAI } from '@google/generative-ai';

declare var bootstrap: any; // isso expõe a instância JS do Bootstrap

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.css'],
    standalone: false
})
export class MainPageComponent implements AfterViewInit {
  expeditions: Expeditions[] = [];
  activeExpeditions: Expeditions[] = [];
  lastExpeditions: Expeditions[] = [];
  crewImages: string[] = [];
  expeditionImages: { [name: string]: string } = {};
  private genAI: GoogleGenerativeAI;


  constructor(private expeditionService: ExpeditionService
  ) { 
    this.genAI = new GoogleGenerativeAI('AIzaSyC6Vd9f4ta2kLLRmgnwBwZF7jYpoYYWYYk');
  }

ngOnInit() {
  this.expeditionService.getExpeditions().subscribe(data => {
    this.expeditions = data;
    for (let i = 0; i < this.expeditions.length; i++) {
      const exp = this.expeditions[i];
      if (exp.end == null) {
        this.activeExpeditions.push(exp);
      } else {
        this.lastExpeditions.push(exp);
      }
    }
    this.expeditions.forEach(expedition => {
      this.expeditionService.getCrewPhoto(expedition.name).subscribe(url => {
        this.expeditionImages[expedition.name] = url || 'assets/default.jpg';
      });
    });
  });
  this.buscaTeste('Expedição 71');
}

async buscaTeste(prompt: string) {
  let busca = 'Utilizando fontes confiáveis e o mais precisas possivel, me retorne uma ddescrição didática sobre ' + prompt+'Caso não existam informações confiáveis, apenas retorne "Dados não encontraos"'
  const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });


  const result = await model.generateContent(busca);
  const response = await result.response;
  const text = response.text();

  console.log(text)

  return text;
}

ngAfterViewInit(): void {
  setTimeout(() => {
    const myCarouselElement = document.querySelector('#carouselExampleCaptions');
    if (myCarouselElement) {
      new bootstrap.Carousel(myCarouselElement);
    }
  }, 5000);
}

getImage(expedition: string): string {
  return this.expeditionImages[expedition];
}
}
  
  
  