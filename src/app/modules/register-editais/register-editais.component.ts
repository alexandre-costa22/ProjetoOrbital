import { Component, OnInit } from '@angular/core';
import { EditaisService } from '../../services/editais.service';
import { BancasService } from '../../services/bancas.service';
import { firstValueFrom } from 'rxjs';
import { Banca } from '../../class/itemBancas';

@Component({
  selector: 'app-register-editais',
  templateUrl: './register-editais.component.html',
  styleUrls: ['./register-editais.component.css']
})
export class RegisterEditaisComponent implements OnInit {
  gatilhoAtualiza: boolean = false;
  idAtual: string = '';
  bancas: any[] = [];
  editais: any[] = [];
  newEdital = { titulo: '', descricao: '', nome_banca: '', valor: '', link: '', vencimento: '', data_publicacao: '' };

  constructor(private editaisService: EditaisService, private bancasService: BancasService) {}

  ngOnInit(): void {
    this.fetchBancas();

    this.editaisService.getEditais().subscribe((data) => {
      this.editais = data;
    });
  }

  async fetchBancas(): Promise<void> {
    try {
      const dados = await firstValueFrom(this.bancasService.getBancas());
      this.bancas = dados.map((item: any) => new Banca(item));
    } catch (error) {
      console.error('Erro ao buscar as bancas:', error);
    }
  }

  gatilhoAtualizacao(titulo: string = '', descricao: string = '', nome_banca: string = '', valor: string = '', link: string = '', vencimento: string = '', data_publicacao: string = '', id: string = '') {
    if (!this.gatilhoAtualiza) {
        this.gatilhoAtualiza = true;
        this.idAtual = id;
        this.newEdital = { titulo, descricao, nome_banca, valor, link, vencimento, data_publicacao };
    } else {
        this.gatilhoAtualiza = false;
        this.newEdital = { titulo: '', descricao: '', nome_banca: '', valor: '', link: '', vencimento: '', data_publicacao: '' };
    }
}

  addEdital() {
    if (this.newEdital.titulo && this.newEdital.descricao && this.newEdital.nome_banca) {
      this.editaisService.addEdital(this.newEdital);
      this.newEdital = { titulo: '', descricao: '', nome_banca: '', valor: '', link: '', vencimento: '', data_publicacao: '' };
    }
  }

  updateEdital(id: string): void{
        if (this.newEdital.titulo.trim() && this.newEdital.descricao && this.newEdital.nome_banca.trim() && this.newEdital.valor && 
        this.newEdital.link && this.newEdital.vencimento && this.newEdital.data_publicacao ) {
          this.editaisService.updateEdital(id, {
            titulo: this.newEdital.titulo,
            descricao: this.newEdital.descricao,
            nome_banca: this.newEdital.nome_banca,
            valor: this.newEdital.valor,
            link: this.newEdital.link,
            vencimento: this.newEdital.vencimento,
            data_publicacao: this.newEdital.data_publicacao
          }).then(() => {
            console.log('Banca atualizada com sucesso');
            this.newEdital = { titulo: '', descricao: '', nome_banca: '', valor: '', link: '', vencimento: '',  data_publicacao: ''};
          }).catch((err) => {
            console.error('Erro ao atualizar banca:', err);
          });
        } else {
          alert('Por favor, preencha todos os campos antes de atualizar uma banca.');
        }
        this.idAtual = "";
}

  deleteEdital(id: string) {
    this.editaisService.deleteEdital(id);
  }
}
