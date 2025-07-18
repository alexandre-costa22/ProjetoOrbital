// src/app/_components/astronauts/astronauts.component.ts

import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { AstronautService } from '../../services/astronaut.service'; // Assumindo DadosService para ser similar
import { Astronaut } from '../../models/astronauts.model';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms'; // 
import { DadosService } from '../../services/expeditions.service';

declare var bootstrap: any;

@Component({
  selector: 'app-astronauts',
  templateUrl: './astronauts.component.html',
  styleUrls: ['./astronauts.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatProgressSpinnerModule,
    FormsModule 
  ]
})
export class AstronautsComponent implements OnInit, AfterViewInit {

  @Input() isMainAstronautPage: boolean = true; 

  allAstronauts: Astronaut[] = [];
  activeAstronauts: Astronaut[] = [];
  retiredAstronauts: Astronaut[] = [];
  astronautImages: { [id: number]: string } = {}; 

  pageSize: number = 9;
  pageIndex: number = 0;
  totalPages: number = 1;
  paginatedRetiredAstronauts: Astronaut[] = [];
  pageSizeOptions: number[] = [6, 9, 12, 15];

  isLoading: boolean = true;

  constructor(
    private astronautService: AstronautService,
    private dadosService: DadosService
  ) {}

  async ngOnInit() {
    this.isLoading = true;

    this.astronautService.getAstronauts().subscribe({
      next: (response) => {
        this.allAstronauts = response.astronauts || []; // Garante que é um array

        this.activeAstronauts = [];
        this.retiredAstronauts = [];

        for (const astronaut of this.allAstronauts) {
          if (astronaut.status === 'Retired' || astronaut.status === 'Deceased') {
            this.retiredAstronauts.push(astronaut);
          } else {
            this.activeAstronauts.push(astronaut);
          }
          // Armazena a URL da imagem usando o ID como chave
          this.astronautImages[astronaut.id] = astronaut.imageUrl || 'assets/default-astronaut.jpg';
        }

        this.isLoading = false;
        this.calculateTotalPagesAndPaginate();
      },
      error: (err) => {
        console.error('Falha ao buscar astronautas no serviço:', err);
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const carouselElement = document.querySelector('#astronautsCarousel');
      if (carouselElement && this.activeAstronauts.length > 0) { 
        new bootstrap.Carousel(carouselElement);
      }
    }, 1000);
  }

  calculateTotalPagesAndPaginate() {
    this.totalPages = Math.ceil(this.retiredAstronauts.length / this.pageSize);
    this.paginateRetiredAstronauts();
  }

  paginateRetiredAstronauts() {
    const startIndex: number = this.pageIndex * this.pageSize;
    const endIndex: number = startIndex + parseInt(this.pageSize.toString());
    this.paginatedRetiredAstronauts = this.retiredAstronauts.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.paginateRetiredAstronauts();
  }

  changePage(delta: number) {
    const newPageIndex = this.pageIndex + delta;
    if (newPageIndex >= 0 && newPageIndex < this.totalPages) {
      this.pageIndex = newPageIndex;
      this.paginateRetiredAstronauts();
    }
  }

  changePageSize(newSize: number) {
    this.pageSize = newSize;
    this.pageIndex = 0;
    this.calculateTotalPagesAndPaginate();
  }

  getImage(astronautId: number): string {
    return this.astronautImages[astronautId] || 'assets/default-astronaut.jpg';
  }

  abreTela(astronaut: Astronaut) {
    let obj = {
      item: astronaut,
      imgSrc: this.getImage(astronaut.id),
      itemCateg: 'astronaut'
    };
    this.dadosService.atualizarDados(obj);
  }

  get currentPageDisplay(): number {
    return this.pageIndex + 1;
  }
}