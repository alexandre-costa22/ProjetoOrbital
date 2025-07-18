import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { SpacecraftService } from '../../services/spacecraft.service'; // Assumindo DadosService para ser similar
import { Spaceship } from '../../models/spacecraft.model';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { PageEvent } from '@angular/material/paginator'; // Importe PageEvent
import { FormsModule } from '@angular/forms'; // Importe FormsModule para ngModel
import { DadosService } from '../../services/expeditions.service';

declare var bootstrap: any;

@Component({
  selector: 'app-spaceships',
  templateUrl: './spaceships.component.html',
  styleUrls: ['./spaceships.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatProgressSpinnerModule,
    FormsModule // Adicione FormsModule
  ]
})
export class SpaceshipsComponent implements OnInit, AfterViewInit {

  @Input() isMainSpaceshipsPage: boolean = true;

  allSpaceships: Spaceship[] = [];
  activeSpaceships: Spaceship[] = [];
  retiredSpaceships: Spaceship[] = [];
  spaceshipImages: { [name: string]: string } = {}; // Para armazenar URLs de imagem, se aplicável

  pageSize: number = 9;
  pageIndex: number = 0;
  totalPages: number = 1;
  paginatedRetiredSpaceships: Spaceship[] = [];
  pageSizeOptions: number[] = [6, 9, 12, 15];

  isLoading: boolean = true;

  constructor(
    private spacecraftService: SpacecraftService,
    private dadosService: DadosService 
  ) {}

  async ngOnInit() {
    this.isLoading = true;

    this.spacecraftService.getSpaceships().subscribe({
      next: (response) => {
        this.allSpaceships = response.spaceships || [];

        this.activeSpaceships = [];
        this.retiredSpaceships = [];

        for (const ship of this.allSpaceships) {
          if (ship.status.name === 'Retired' || ship.status.name === 'Destroyed') {
            this.retiredSpaceships.push(ship);
          } else {
            this.activeSpaceships.push(ship);
          }
        }

        this.allSpaceships.forEach(ship => {
          this.spaceshipImages[ship.name] = ship.config?.imageUrl || 'assets/default-spaceship.jpg';
        });

        this.isLoading = false;
        this.calculateTotalPagesAndPaginate();
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

  calculateTotalPagesAndPaginate() {
    this.totalPages = Math.ceil(this.retiredSpaceships.length / this.pageSize);
    this.paginateRetiredSpaceships();
  }

  paginateRetiredSpaceships() {
    const startIndex: number = this.pageIndex * this.pageSize;
    const endIndex: number = startIndex + parseInt(this.pageSize.toString());
    this.paginatedRetiredSpaceships = this.retiredSpaceships.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.paginateRetiredSpaceships();
  }

  changePage(delta: number) {
    const newPageIndex = this.pageIndex + delta;
    if (newPageIndex >= 0 && newPageIndex < this.totalPages) {
      this.pageIndex = newPageIndex;
      this.paginateRetiredSpaceships();
    }
  }

  changePageSize(newSize: number) {
    this.pageSize = newSize;
    this.pageIndex = 0;
    this.calculateTotalPagesAndPaginate();
  }

  getImage(spaceshipName: string): string {
    return this.spaceshipImages[spaceshipName] || 'assets/default-spaceship.jpg';
  }

  abreTela(spaceship: Spaceship) {
    let obj = {
      item: spaceship,
      imgSrc: this.getImage(spaceship.name),
      itemCateg: 'spaceship'
    };
    this.dadosService.atualizarDados(obj);
  }

  get currentPageDisplay(): number {
    return this.pageIndex + 1;
  }
}