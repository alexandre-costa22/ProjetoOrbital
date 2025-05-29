import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  message = new BehaviorSubject('default message');
  getMessage = this.message.asObservable();

  constructor() { }

  setMessage(message: string) {
    this.message.next(message)
  }
}
