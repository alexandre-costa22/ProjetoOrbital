import { Component, AfterViewInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { environment } from '../../../environments/environments';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

declare var bootstrap: any;

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
  standalone: false
})
export class MainPageComponent implements AfterViewInit {



  constructor() {}

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const myCarouselElement = document.querySelector('#carouselExampleCaptions');
      if (myCarouselElement) {
        new bootstrap.Carousel(myCarouselElement);
      }
    }, 5000);
  }


    
}
