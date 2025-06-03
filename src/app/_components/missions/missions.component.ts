import { Component, OnInit, AfterViewInit } from '@angular/core';
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

  expeditions: Expeditions[] = [];
  activeExpeditions: Expeditions[] = [];
  lastExpeditions: Expeditions[] = [];
  expeditionImages: { [name: string]: string } = {};

  constructor(private expeditionService: ExpeditionService) {}

  ngOnInit() {
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
