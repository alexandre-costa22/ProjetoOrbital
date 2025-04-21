import { Component } from '@angular/core';
import { Edital } from '../../class/itemEditais';
import { EditaisService } from '../../services/editais.service';
import { firstValueFrom } from 'rxjs';
import { BancasService } from '../../services/bancas.service';
import { Banca } from '../../class/itemBancas';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {
  bancas: any[] = [];
  selectedBanca: string = '';
  filtrarResultados: string = '';  
  editais: Edital[] = [];
  itemsPerPage = 10;
  currentPage = 1;
  loading: boolean = false;

  constructor() { }

  ngOnInit() {
  }
}
