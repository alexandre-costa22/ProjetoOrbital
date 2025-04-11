import { Component, OnInit } from '@angular/core';
import { BancasService } from '../../services/bancas.service';

@Component({
  selector: 'app-register-banca',
  templateUrl: './register-banca.component.html',
  styleUrls: ['./register-banca.component.css']
})
export class RegisterBancaComponent implements OnInit {
  bancas: any[] = [];
  newBanca = { nome_banca: '', img_logo: null as File | null, data_criacao: '' };
  selectedFile: File | null = null;
  gatilhoAtualiza: boolean = false
  idAtual: any;

  constructor(private bancasService: BancasService) {}


  ngOnInit(): void {
    this.gatilhoAtualiza = false;
    this.idAtual = "";
    this.bancasService.getBancas().subscribe({
      next: (data) => {
        this.bancas = data;
      },
      error: (err) => {
        console.error('Erro ao buscar bancas:', err); }
    });
  }


  addBanca(): void {
    if (this.newBanca.nome_banca.trim() && this.newBanca.img_logo && this.newBanca.data_criacao.trim()) {
      this.bancasService.addBanca({
        nome_banca: this.newBanca.nome_banca,
        img_logo: this.newBanca.img_logo,
        data_criacao: this.newBanca.data_criacao
      }).then(() => {
        console.log('Banca adicionada com sucesso');
        this.newBanca = { nome_banca: '', img_logo: null, data_criacao: '' };
      }).catch((err) => {
        console.error('Erro ao adicionar banca:', err);
      });
    } else {
      alert('Por favor, preencha todos os campos antes de adicionar uma banca.');
    }
  }

  gatilhoAtualizacao(id: string = ""): void {
    this.idAtual = id;
  
    if (!this.gatilhoAtualiza) { 
      this.gatilhoAtualiza = true; 
    } else {
      this.gatilhoAtualiza = false; 
    }
  }
  
  updateBanca(id: string): void {
    if (this.newBanca.nome_banca.trim() && this.newBanca.img_logo && this.newBanca.data_criacao.trim()) {
      this.bancasService.updateBanca(id, {
        nome_banca: this.newBanca.nome_banca,
        img_logo: this.newBanca.img_logo, 
        data_criacao: this.newBanca.data_criacao
      }).then(() => {
        console.log('Banca atualizada com sucesso');
        this.newBanca = { nome_banca: '', img_logo: null, data_criacao: '' };
      }).catch((err) => {
        console.error('Erro ao atualizar banca:', err);
      });
    } else {
      alert('Por favor, preencha todos os campos antes de atualizar uma banca.');
    }
    this.idAtual = "";
  }

  deleteBanca(id: string): void {
    this.bancasService.deleteBanca(id).then(() => {
      console.log('Banca removida com sucesso');
    }).catch((err) => {
      console.error('Erro ao deletar banca:', err);
    });
  }
}
