import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Expeditions } from '../../models/expeditions.model';
import { Spaceships } from '../../models/spaceshps.model';
import { SpaceshipsService } from '../../services/spaceships.service';

declare var bootstrap: any;

@Component({
  selector: 'app-spaceships',
  templateUrl: './spaceships.component.html',
  styleUrl: './spaceships.component.css',
  standalone: false
})
export class SpaceshipsComponent implements OnInit, AfterViewInit {

  @Input() isMainMissionPage: boolean = true;

  spaceships: Spaceships[] = [];
  activeSpaceships: Spaceships[] = [];
  lastSpaceships: Spaceships[] = [];
  spaceshipsImages: { [name: string]: string } = {};
  
  isLoading: boolean = true; // loader ativo

  constructor(private spaceshipsService: SpaceshipsService) {}

  ngOnInit() {
    this.isLoading = true; 
    
    this.spaceshipsService.getSpaceships().subscribe(data => {
      this.spaceships = data;
      const photoObservables = this.spaceships.map(spaceships =>
        this.spaceshipsService.getSpaceshipPhotos(spaceships.name)
      );

      Promise.all(photoObservables.map(obs => obs.toPromise())).then(results => {
        results.forEach((urls, i) => {
          this.spaceshipsImages[this.spaceships[i].name] = (urls && urls.length > 0) ? urls[0] : 'assets/default.jpg';
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

  getImage(spaceship: string): string {
    return this.spaceshipsImages[spaceship];
  }
}
