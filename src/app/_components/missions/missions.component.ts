import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { DadosService, ExpeditionService } from '../../services/expeditions.service';
import { Expeditions } from '../../models/expeditions.model';
import { collection, addDoc, updateDoc , getDoc, deleteDoc, query, where, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { environment } from '../../../environments/environments';
import { finalize, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { EnvironmentConfiguration } from '../../key/apiKey';

declare var bootstrap: any;

@Component({
  selector: 'app-missions',
  templateUrl: './missions.component.html',
  styleUrls: ['./missions.component.css'],
  standalone: false
})
export class MissionsComponent implements OnInit, AfterViewInit {

  @Input() isMainMissionPage: boolean = true;

  expeditions: Expeditions[] = [];
  activeExpeditions: Expeditions[] = [];
  lastExpeditions: Expeditions[] = [];
  expeditionImages: { [name: string]: string } = {};
  
  isLoading: boolean = true; 

    genAI = new GoogleGenerativeAI(EnvironmentConfiguration.apiKey);

  

  constructor(private expeditionService: ExpeditionService,
    private http: HttpClient,
    private dadosService: DadosService
  ) {}


  //RETORNA ITENS DO BANCO (GET)
  // try {
  //   // 2. Use getDoc para obter o "snapshot" (foto) do documento
  //   const citySnap = await getDoc(cityRef);

  //   // 3. Verifique se o documento existe
  //   if (citySnap.exists()) {
  //     console.log("Dados do documento:", citySnap.data());
  //     // Você pode acessar os dados diretamente:
  //     const cityData = citySnap.data();
  //     console.log(`Nome da cidade: ${cityData.name}, População: ${cityData.population}`);
  //     return cityData;
  //   } else {
  //     // O documento não existe!
  //     console.log("Nenhum documento encontrado com o ID:", cityId);
  //     return null;
  //   }
  // } catch (error) {
  //   console.error("Erro ao obter documento: ", error);
  //   return null;
  // }


  //ATUALIZA ITENS DO BANCO (PUT)
  // try {
  //   // 2. Use updateDoc para atualizar campos específicos do documento
  //   //    Isso não sobrescreve o documento inteiro, apenas os campos que você especificar.
  //   await updateDoc(cityRef, {
  //     population: newPopulation,
  //     // Você pode adicionar ou atualizar outros campos aqui também
  //     lastUpdated: new Date() // Exemplo: adicionar um timestamp de atualização
  //   });
  //   console.log(`Documento com ID ${cityId} atualizado com sucesso!`);
  // } catch (error) {
  //   console.error("Erro ao atualizar documento: ", error);
  // }



  //DELETA ITENS DO BANCO (DELETE)
  // try {
  //   // 2. Use deleteDoc para remover o documento
  //   await deleteDoc(cityRef);
  //   console.log(`Documento com ID ${cityId} deletado com sucesso!`);
  // } catch (error) {
  //   console.error("Erro ao deletar documento: ", error);
  // }


  async ngOnInit() {
    this.isLoading = true;
    const app = initializeApp(environment.firebase);
    const db = getFirestore(app);
    const expeditionsCollection = collection(db, 'expeditions');
    const snapshot = await getDocs(expeditionsCollection);

    this.expeditions = snapshot.docs
    .filter(doc => {
      const desc = doc.data()['description'];
      return desc !== null && desc !== undefined && desc !== '';
    })
    .map(doc => {
      return {
        ...doc.data(),
      } as Expeditions;
    });

    for (const exp of this.expeditions) {
      if (exp.endDate == null) {
        this.activeExpeditions.push(exp);
      } else {
        this.lastExpeditions.push(exp);
      }
    }

    const photoObservables = this.expeditions.map(expedition =>
    this.expeditionService.getCrewPhoto(expedition.name)
      );

    if (photoObservables.length > 0) {
      forkJoin(photoObservables).pipe(
        finalize(() => this.isLoading = false) 
      ).subscribe(results => {
        results.forEach((url, i) => {
          this.expeditionImages[this.expeditions[i].name] = url || 'assets/default.jpg';
        });
      });
    }
    this.isLoading = false; 
  


  }


  ngAfterViewInit(): void {
    setTimeout(() => {
      const myCarouselElement = document.querySelector('#carouselExampleCaptions');
      if (myCarouselElement) {
        new bootstrap.Carousel(myCarouselElement);
      }
    }, 5000);
  }


  abreTela(expedition: any){
    console.log(expedition)
    let obj = {
      expedition: expedition,
      imgSrc: this.expeditionImages[expedition.name]
    }
    this.dadosService.atualizarDados(obj);
  }


  getImage(expedition: string): string {
    return this.expeditionImages[expedition];
  }
  
}
