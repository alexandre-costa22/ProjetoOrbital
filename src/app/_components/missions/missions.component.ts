import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { ExpeditionService } from '../../services/expeditions.service';
import { Expeditions } from '../../models/expeditions.model';

declare var bootstrap: any;

@Component({
  selector: 'app-missions',
  templateUrl: './missions.component.html',
  styleUrls: ['./missions.component.css'],
  standalone: false
})
export class MissionsComponent implements OnInit, AfterViewInit {

  @Input() isMainMissionPage: boolean = true;

  expeditions: Expeditions[] = [];
  activeExpeditions: Expeditions[] = [];
  lastExpeditions: Expeditions[] = [];
  expeditionImages: { [name: string]: string } = {};
  
  isLoading: boolean = true; // loader ativo

  constructor(private expeditionService: ExpeditionService) {}

  ngOnInit() {
    this.isLoading = true; // ativa loader no início
    
    this.expeditionService.getExpeditions().subscribe(data => {
      this.expeditions = data;
      this.activeExpeditions = [];
      this.lastExpeditions = [];

      for (let i = 0; i < this.expeditions.length; i++) {
        const exp = this.expeditions[i];
        if (exp.end == null) {
          this.activeExpeditions.push(exp);
        } else {
          this.lastExpeditions.push(exp);
        }
      }

      const photoObservables = this.expeditions.map(expedition =>
        this.expeditionService.getCrewPhoto(expedition.name)
      );

      Promise.all(photoObservables.map(obs => obs.toPromise())).then(results => {
        results.forEach((url, i) => {
          this.expeditionImages[this.expeditions[i].name] = url || 'assets/default.jpg';
        });
        this.isLoading = false;
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
