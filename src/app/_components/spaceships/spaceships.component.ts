

import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { SpacecraftService } from '../../services/spacecraft.service';
import { Spaceship } from '../../models/spacecraft.model';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-spaceships',
  templateUrl: './spaceships.component.html',
  styleUrls: ['./spaceships.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatProgressSpinnerModule
  ]
})
export class SpaceshipsComponent implements OnInit, AfterViewInit {

  @Input() isMainSpaceshipsPage: boolean = true;

  activeSpaceships: Spaceship[] = [];
  retiredSpaceships: Spaceship[] = [];
  isLoading: boolean = true;


  constructor(private spacecraftService: SpacecraftService) {}

  ngOnInit() {
    this.isLoading = true;

    this.spacecraftService.getSpaceships().subscribe({
      next: (response) => {

        console.log('Resposta da API recebida:', response);


        const allSpaceships = response || [];

        console.log(response)

        // for (const ship of allSpaceships) {
        //   if (ship.status.name === 'Retired' || ship.status.name === 'Destroyed') {
        //     this.retiredSpaceships.push(ship);
        //   } else {

        //     this.activeSpaceships.push(ship);
        //   }
        // }


        console.log('Naves Ativas/Em Construção:', this.activeSpaceships);
        console.log('Naves Aposentadas:', this.retiredSpaceships);

        this.isLoading = false;
      },
      error: (err) => {

        console.error('Falha ao buscar espaçonaves no serviço:', err);
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit(): void {

    setTimeout(() => {
      const carouselElement = document.querySelector('#spaceshipsCarousel');
      if (carouselElement && this.activeSpaceships.length > 0) {
        new bootstrap.Carousel(carouselElement);
      }
    }, 1000);
  }
}
