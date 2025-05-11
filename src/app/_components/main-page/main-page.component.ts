import { Component } from '@angular/core';
import { ExpeditionService } from '../../services/expeditions.service';
import { Expeditions } from '../../models/expeditions.model';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {
  expeditions: Expeditions[] = [];
  activeExpeditions: Expeditions[] = [];

  constructor(private expeditionService: ExpeditionService) { }

  ngOnInit() {
    this.expeditionService.getExpeditions().subscribe(data => {
      this.expeditions = data;
      for (let i = 0; i < this.expeditions.length; i++) {
        if (this.expeditions[i].end == null) {
          this.activeExpeditions.push(this.expeditions[i]);
        }
      }
    });
  }
}
  
  
  