import { Component } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { EnvironmentConfiguration } from '../../key/apiKey';
import { ActivatedRoute } from '@angular/router';
import { marked } from 'marked';
import { DadosService, ExpeditionService } from '../../services/expeditions.service';
import { Expeditions } from '../../models/expeditions.model';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ShareItComponent } from '../_modals/share-it/share-it.component';
import { forkJoin, take } from 'rxjs';
import { WikipediaService } from '../../services/wiki-infos.service';
import { ViewportScroller } from '@angular/common';
import { initializeApp } from 'firebase/app';
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { environment } from '../../../environments/environments';
import { FavoriteItems } from '../../models/favoriteItems.model copy';
import { FavoriteItemsService } from '../../app.component';
import { FavoriteItem } from '../favorites/favorites.component';


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
  db = getFirestore();
  itemCateg: string = ''
  favoriteMissions: FavoriteItem[] = [];

  uid: string = '';


  favoriteItemsCollection: FavoriteItems[] = []

  isFavorito: boolean = false;
  favoritoId: string | null = null;
  userId: string = '';


  constructor(
    private route: ActivatedRoute,
    private expeditionService: ExpeditionService,
    private bottomSheet: MatBottomSheet,
    private wiki: WikipediaService,
    private dadosService: DadosService,
    private favoriteItemsService: FavoriteItemsService
  ) { }

  ngOnInit() {
    this.dadosService.dados$.subscribe(data => {
    this.description = marked(data.expedition.description);
    this.name = data.expedition.name;
    this.itemCateg = data.itemCateg
    this.srcImg = data.imgSrc
    this.verificarFavorito();
    });


    this.favoriteItemsService.dados$.subscribe(data => {
      for(let i = 0; i < data.length; i++){
          const item = new FavoriteItem();
          item.id = data[i].userId;
          item.name = data[i].itemId;
          item.type = data[i].itemCateg;
        
          this.favoriteMissions.push(item);
      }
      this.uid = data.uids[0]
    });
  }

  addFavorite() {
    const newFavorite = {
      userId: this.uid,
      itemId: this.name,
      itemCateg: this.itemCateg
    };
  
    const favoriteItemsRef = collection(this.db, 'favoriteItems');
    addDoc(favoriteItemsRef, newFavorite).then(() => {
      this.favoriteMissions.push({
        id: newFavorite.userId,
        name: newFavorite.itemId,
        type: newFavorite.itemCateg,
        imageUrl: ''
      });
      
    });
  }
  
  async removeFavorite() {
    const favoriteItemsRef = collection(this.db, 'favoriteItems');
    const q = query(favoriteItemsRef, 
      where("userId", "==", this.userId),
      where("itemId", "==", this.name),
      where("itemCateg", "==", this.itemCateg)
    );
    const snapshot = await getDocs(q);
    snapshot.forEach(async (docSnap) => {
      await deleteDoc(doc(this.db, 'favoriteItems', docSnap.id));
    });
    this.favoriteMissions = this.favoriteMissions.filter(item => item.name !== this.name);
    this.isFavorited()
  }  

  toggleFavorite() {
    const isAlreadyFavorited = this.favoriteMissions.some(item => item.name === this.name);
  
    if (isAlreadyFavorited) {
      this.removeFavorite();
    } else {
      this.addFavorite();
    }
  }
  

  isFavorited(): boolean {
    return this.favoriteMissions.some(item => item.name === this.name);
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
  redirecionarParaAcervoNasa(termoPesquisa: string) {
    
    const urlNasa = `https://images.nasa.gov/search-results?q=${encodeURIComponent(termoPesquisa)}&media=image`
    
    const link = document.createElement("a");
    link.href = urlNasa;
    link.target = "_blank"; // abre nova guia
    link.rel = "noopener noreferrer"; // segurança
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  async verificarFavorito() {
    const app = initializeApp(environment.firebase);
    const db = getFirestore(app);
  
    const favoriteItemsCollection = collection(db, 'favoriteItems');
    const q = query(
      favoriteItemsCollection,
      where('itemId', '==', this.name),
      where('userId', '==', this.uid),
      where('itemCateg', '==', this.itemCateg)
    );
  
    const snapshot = await getDocs(q);
  
    this.favoriteItemsCollection = snapshot.docs.map(doc => doc.data() as FavoriteItems);
  
    if (!snapshot.empty) {
      this.isFavorito = true;
      this.favoritoId = snapshot.docs[0].id;
    } else {
      this.isFavorito = false;
      this.favoritoId = null;
    }
  }

  // toggleFavorito(itemId: string, itemCateg: string): void {
  //   const app = initializeApp(environment.firebase);
  //   const db = getFirestore(app);
  
  //   const favoriteItemsCollection = collection(db, 'users');
  //   if (this.isFavorito && this.favoritoId) {
  //     this.afs.collection('users').doc(this.favoritoId).delete().then(() => {
  //       this.isFavorito = false;
  //       this.favoritoId = null;
  //     });
  //   } else {
  //     this.afs.collection('favoriteItems').add({
  //       itemId,
  //       itemCateg,
  //       userId: this.userId
  //     }).then(docRef => {
  //       this.isFavorito = true;
  //       this.favoritoId = docRef.id;
  //     });
  //   }}
}
