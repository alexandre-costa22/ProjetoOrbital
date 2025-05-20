import { Component, AfterViewInit  } from '@angular/core';
import { ExpeditionService } from '../../services/expeditions.service';
import { Expeditions } from '../../models/expeditions.model';
import { OpenaiService } from '../../services/ask.service';
import { HttpClient } from '@angular/common/http';

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


  constructor(private expeditionService: ExpeditionService,
    private openaiService: OpenaiService,
    private http: HttpClient
  ) { 
  }

ngOnInit() {
  this.buscaTeste();
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
}

buscaTeste() {
  const pergunta = {
    question: 'Qual a capital da França?'
  };

  this.http.post('http://localhost:3333/ask', pergunta).subscribe({
    next: (res) => {
      console.log('Resposta:', res);
    },
    error: (err) => {
      console.error('Erro na requisição:', err);
    }
  });}

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
  
  
  