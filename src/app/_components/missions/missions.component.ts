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
import { PageEvent } from '@angular/material/paginator';
import { getAuth } from 'firebase/auth';

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

  pageSize: number = 9;
  pageIndex: number = 0;
  totalPages: number = 1;
  paginatedLastExpeditions: Expeditions[] = [];
  pageSizeOptions: number[] = [6, 9, 12, 15];

  isLoading: boolean = true;


  genAI = new GoogleGenerativeAI(EnvironmentConfiguration.apiKey);


  constructor(private expeditionService: ExpeditionService,
    private http: HttpClient,
    private dadosService: DadosService
  ) {}

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

    this.activeExpeditions = [];
    this.lastExpeditions = [];

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
        finalize(() => {
          this.isLoading = false;
          this.calculateTotalPagesAndPaginate(); 
        })
      ).subscribe(results => {
        results.forEach((url, i) => {
          this.expeditionImages[this.expeditions[i].name] = url || 'assets/default.jpg';
        });
      });
    } else {
      this.isLoading = false;
      this.calculateTotalPagesAndPaginate(); 
    }

  }


  ngAfterViewInit(): void {
    setTimeout(() => {
      const myCarouselElement = document.querySelector('#carouselExampleCaptions');
      if (myCarouselElement) {
        new bootstrap.Carousel(myCarouselElement);
      }
    }, 5000);
  }


 


  calculateTotalPagesAndPaginate() {
    this.totalPages = Math.ceil(this.lastExpeditions.length / this.pageSize);
    this.paginateLastExpeditions();
  }

  paginateLastExpeditions() {
    const startIndex: number = this.pageIndex * this.pageSize;
    const endIndex: number = startIndex + parseInt(this.pageSize.toString());

    this.paginatedLastExpeditions = this.lastExpeditions.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.paginateLastExpeditions();
  }

  changePage(delta: number) {
    const newPageIndex = this.pageIndex + delta;
    if (newPageIndex >= 0 && newPageIndex < this.totalPages) {
      this.pageIndex = newPageIndex;
      this.paginateLastExpeditions();
    } else {
    }
  }

  abreTela(expedition: any){
    console.log(expedition)
    let obj = {
      expedition: expedition,
      imgSrc: this.expeditionImages[expedition.name]
    }
    this.dadosService.atualizarDados(obj);
  }

  changePageSize(newSize: number) {
    this.pageSize = newSize;
    this.pageIndex = 0; 
    console.log('pageIndex reset to 0.');
    this.calculateTotalPagesAndPaginate();
  }

  getImage(expedition: string): string {
    return this.expeditionImages[expedition];
  }

  get currentPageDisplay(): number {
    return this.pageIndex + 1;
  }

}