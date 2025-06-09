import { Component } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { EnvironmentConfiguration } from '../../key/apiKey';
import { ActivatedRoute } from '@angular/router';
import { marked } from 'marked';
import { ExpeditionService } from '../../services/expeditions.service';
import { Expeditions } from '../../models/expeditions.model';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ShareItComponent } from '../_modals/share-it/share-it.component';
import { forkJoin } from 'rxjs';

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
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private expeditionService: ExpeditionService,
    private bottomSheet: MatBottomSheet
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.name = params.get('name') ?? '';
      this.loadData();
    });
  }

  loadData() {
    this.expeditionService.getExpeditions().subscribe(expeditionsData => {
      this.expeditions = expeditionsData;

      // Mapeia todas as chamadas para fotos em um array
      const imageRequests = this.expeditions.map(expedition =>
        this.expeditionService.getCrewPhoto(expedition.name)
      );

      // Aguarda todas as imagens e a descrição
      forkJoin(imageRequests).subscribe(urls => {
        urls.forEach((url, index) => {
          const expeditionName = this.expeditions[index].name;
          this.expeditionImages[expeditionName] = url || 'assets/default.jpg';
        });

        // Depois de imagens, chama descrição
        this.run('Utilizando fontes confiáveis e de forma didática, me retorne uma descrição detalhada de ' +
          this.name + ', realizada com o apoio da NASA. Cite os seguintes tópicos: Objetivo(s) principal(ais), data de inicio e término da missão, curiosidades e fontes. Cite as fontes que utilizou no fim da resposta.')
          .then(() => {
            this.isLoading = false; // Só aqui o loader some
          });
      });
    });
  }

  async run(prompt: string) {
    const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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
