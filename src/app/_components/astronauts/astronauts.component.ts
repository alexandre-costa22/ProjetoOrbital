// src/app/_components/astronauts/astronauts.component.ts

import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { AstronautService } from '../../services/astronaut.service';
import { Astronaut } from '../../models/astronauts.model';

// ================== INÍCIO DA CORREÇÃO ==================
// Importe os módulos necessários
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// =================== FIM DA CORREÇÃO ===================

declare var bootstrap: any;

@Component({
  selector: 'app-astronauts',
  templateUrl: './astronauts.component.html',
  styleUrls: ['./astronauts.component.css'],

  // ================== INÍCIO DA CORREÇÃO ==================
  standalone: true, // Garante que o componente é standalone
  imports: [
    CommonModule,             // Para *ngIf, *ngFor e o pipe 'date'
    RouterModule,             // Para a diretiva [routerLink]
    MatProgressSpinnerModule  // Para o elemento <mat-spinner>
  ]
  // =================== FIM DA CORREÇÃO ===================
})
export class AstronautsComponent implements OnInit, AfterViewInit {

  @Input() isMainAstronautPage: boolean = false

  // ... O resto do seu código TypeScript continua igual e está correto ...
  allAstronauts: Astronaut[] = [];
  activeAstronauts: Astronaut[] = [];
  retiredAstronauts: Astronaut[] = [];
  isLoading: boolean = true;

  constructor(private astronautService: AstronautService) {}

  ngOnInit() {
    this.isLoading = true;

    this.astronautService.getAstronauts().subscribe(response => {
      this.allAstronauts = response.astronauts;
      this.activeAstronauts = [];
      this.retiredAstronauts = [];

      for (const astronaut of this.allAstronauts) {
        if (astronaut.status === 'Retired' || astronaut.status === 'Deceased') {
          this.retiredAstronauts.push(astronaut);
        } else {
          this.activeAstronauts.push(astronaut);
        }
      }

      this.isLoading = false;
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const carouselElement = document.querySelector('#astronautsCarousel');
      if (carouselElement) {
        new bootstrap.Carousel(carouselElement);
      }
    }, 1000);
  }
}
