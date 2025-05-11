import { Component, AfterViewInit  } from '@angular/core';
import { ExpeditionService } from '../../services/expeditions.service';
import { Expeditions } from '../../models/expeditions.model';

declare var bootstrap: any; // isso expõe a instância JS do Bootstrap

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements AfterViewInit {
  expeditions: Expeditions[] = [];
  activeExpeditions: Expeditions[] = [];
  lastExpeditions: Expeditions[] = [];
  crewImages: string[] = [];
  expeditionImages: { [name: string]: string } = {};


  constructor(private expeditionService: ExpeditionService) { }

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
  
  
  