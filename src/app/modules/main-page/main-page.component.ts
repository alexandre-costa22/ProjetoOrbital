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

  constructor(
    private editaisService: EditaisService,
    private bancasService: BancasService) { }

  ngOnInit() {
    this.fetchEditais();
    this.fetchBancas()
  }

  async fetchEditais(): Promise<void> {
    this.loading = true;
    try {
      const dados = await firstValueFrom(this.editaisService.getEditais());
      this.editais = dados.map((item: any) => new Edital(item));
    } catch (error) {
      console.error('Erro ao buscar os editais:', error);
    } finally {
      this.loading = false;
    }
  }

  async fetchBancas(): Promise<void> {
    try {
      const dados = await firstValueFrom(this.bancasService.getBancas());
      this.bancas = [...this.bancas, ...dados.map((item: any) => new Banca(item))];
    } catch (error) {
      console.error('Erro ao buscar as bancas:', error);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  retornaImagem(banca: string) {
    let bancaUpper = banca.toUpperCase()
    if (bancaUpper == "FAPERGS") {
      return "assets/icons/fapergs.png"
    } else if (bancaUpper == "FAPESC") {
      return "assets/icons/FAPESC.png"
    } else if (bancaUpper == "FINEP") {
      return "assets/icons/finep.png"
    } else if (bancaUpper == "FUNDECT") {
      return "assets/icons/fundect.png"
    } else {
      return ""
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  get filteredEditais(): Edital[] {
    return this.editais.filter(edital =>
      (!this.selectedBanca || edital.nome_banca === this.selectedBanca) &&
      (!this.filtrarResultados || 
        edital.titulo.toLowerCase().includes(this.filtrarResultados.toLowerCase()) ||
        edital.descricao.toLowerCase().includes(this.filtrarResultados.toLowerCase()))
    );
  }

  get paginatedEditais(): Edital[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredEditais.slice(startIndex, endIndex);
  }
  
  get totalPages(): number {
    const filteredCount = this.editais.filter(edital =>
      (!this.selectedBanca || this.selectedBanca === 'Todas' || edital.nome_banca === this.selectedBanca) &&
      (!this.filtrarResultados || 
        edital.titulo.toLowerCase().includes(this.filtrarResultados.toLowerCase()) ||
        edital.descricao.toLowerCase().includes(this.filtrarResultados.toLowerCase()))
    ).length;
    return Math.ceil(filteredCount / this.itemsPerPage);
  }
  
  
  
}
