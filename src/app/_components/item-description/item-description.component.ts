import { Component } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { EnvironmentConfiguration } from '../../key/apiKey';
import { ActivatedRoute } from '@angular/router';
import { marked } from 'marked';
import { DadosService, ExpeditionService } from '../../services/expeditions.service';
import { Expeditions } from '../../models/expeditions.model';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ShareItComponent } from '../_modals/share-it/share-it.component';
import { forkJoin } from 'rxjs';
import { WikipediaService } from '../../services/wiki-infos.service';
import { ViewportScroller } from '@angular/common';


@Component({
  selector: 'app-item-description',
  templateUrl: './item-description.component.html',
  styleUrl: './item-description.component.css',
  standalone: false
})
export class ItemDescriptionComponent {

  name: string = '';
  description: any;
  genAI = new GoogleGenerativeAI(EnvironmentConfiguration.apiKey);
  expeditions: Expeditions[] = [];
  expeditionImages: { [name: string]: string } = {};
  isLoading: boolean = false;
  srcImg: any

  constructor(
    private route: ActivatedRoute,
    private expeditionService: ExpeditionService,
    private bottomSheet: MatBottomSheet,
    private wiki: WikipediaService,
    private dadosService: DadosService
  ) { }

  ngOnInit() {
    // this.route.paramMap.subscribe(params => {
    //   this.name = params.get('name') ?? '';
    //   this.buscar(this.name);
    // });

    this.dadosService.dados$.subscribe(data => {
    this.description = marked(data.expedition.description);
    this.name = data.expedition.name;
    this.srcImg = data.imgSrc
    });
   

    
  }
  buscar(name: string) {
    this.isLoading = true;
    window.scrollTo({
      top: 0,
      behavior: 'smooth' 
    });
    this.wiki.buscarWikitexto(name).subscribe({
      next: (texto) => {
        this.loadData(texto);
      }
    });
  }

  loadData(texto?: string) {
    this.expeditionService.getExpeditions().subscribe(expeditionsData => {
      this.expeditions = expeditionsData;

      const imageRequests = this.expeditions.map(expedition =>
        this.expeditionService.getCrewPhoto(expedition.name)
      );

      forkJoin(imageRequests).subscribe(urls => {
        urls.forEach((url, index) => {
          const expeditionName = this.expeditions[index].name;
          this.expeditionImages[expeditionName] = url || 'assets/default.jpg';
        });
        const hoje = new Date();
        const dataFormatada = hoje.toLocaleDateString('pt-BR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
        const prompt = `
        Por favor, reescreva o texto a seguir em estilo enciclopédico, fluido e descritivo.
        Levando em consideração que o dia de hoje é ${dataFormatada}, qualquer menção a um acontecimento posterior 
        a esta data deve ser mencionada como algo que ainda irá acontecer, e não como algo que já aconteceu.
        
        Inclua fontes reais, se disponíveis no conteúdo original, mas não use linguagem metalinguística 
        (como 'o texto original diz', 'a tabela mostra', 'a Wikipedia informa', etc). 
        Exclua qualquer nota editorial, comentários técnicos, instruções para o leitor, referências a formatações Markdown, 
        limitações da ferramenta ou sugestões de conversão de tabela. 
        Se tabelas forem mencionadas, resuma seu conteúdo de forma descritiva no texto, como se estivessem incorporadas naturalmente no artigo. 
        
        O texto deve parecer redigido originalmente como parte de um artigo informativo, de forma clara, impessoal e enciclopédica.
        
        Siga esta estrutura de organização no texto final:
        1. Título
        2. Introdução contextual
        3. Composição da tripulação (se aplicável)
        4. Objetivos da missão
        5. Eventos notáveis durante a missão
        6. Previsões futuras (se houver)
        7. Fontes (no fim do texto, sem data de acesso)
        Se não for possível citar fontes específicas, mencione discretamente que os dados são da Wikipedia.
        \n\n${texto}`;
       
        this.run(prompt)
          .then(() => {
            this.isLoading = false; 
          });
      });
    });
  }

  async run(prompt: string) {
    const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent(prompt + "\n\nPor favor, formate o conteúdo em Markdown.");
    const response = await result.response;
    const text = response.text();
    this.description = marked(text);
  }

  newDescripction() {
    this.isLoading = true;
    const prompt = 'Não gostei da seguinte descrição. Poderia fazer de outra forma? ' + this.description;
    this.run(prompt).then(() => this.isLoading = false);
  }

  share() {
    this.bottomSheet.open(ShareItComponent);
  }

  getImage(expedition: string): string {
    return this.expeditionImages[expedition];
  }
}
