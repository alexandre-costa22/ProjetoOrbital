export class Banca {
    nome_banca!: string;
    img_logo!: File;
    data_criacao!: Date;
  
    constructor(item: any) {
      this.nome_banca = item.nome_banca;
      this.img_logo = item.img_logo;
      this.data_criacao = item.data_criacao;
    }
  }
  