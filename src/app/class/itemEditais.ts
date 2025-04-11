export class Edital {
  nome_banca!: string;
  titulo!: string;
  valor!: number;
  descricao!: string;
  link!: string;
  img_logo!: string;
  vencimento!: Date;
  prazo_execucao!: string;
  valor_global!: number;
  valor_estimado!: number;
  valor_maximo!: number;
  data_publicacao!: Date;

  constructor(item: any) {
    this.nome_banca = item.nome_banca;
    this.titulo = item.titulo;
    this.valor = item.valor;
    this.descricao = item.descricao;
    this.link = item.link;
    this.img_logo = item.img_logo;
    this.vencimento = new Date(item.vencimento);
    this.prazo_execucao = item.prazo_execucao;
    this.valor_global = item.valor_global;
    this.valor_estimado = item.valor_estimado;
    this.valor_maximo = item.valor_maximo;
    this.data_publicacao = new Date(item.data_publicacao);
  }
}
