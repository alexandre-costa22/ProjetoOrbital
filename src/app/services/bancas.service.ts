import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, deleteDoc, doc, updateDoc, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BancasService {
  constructor(private firestore: Firestore) {}

  private getBancasCollection() {
    return collection(this.firestore, 'bancas');
  }

  getBancas(): Observable<any[]> {
    return collectionData(this.getBancasCollection(), { idField: 'id' });
  }

  addBanca(banca: { nome_banca: string,  img_logo: File, data_criacao: string }) {
    return addDoc(this.getBancasCollection(), banca);
  }

  updateBanca(id: string, banca: { nome_banca: string,  img_logo: File, data_criacao: string}) {
    const bancaDoc = doc(this.firestore, `bancas/${id}`);
    return updateDoc(bancaDoc, banca);
  }

  deleteBanca(id: string) {
    const bancaDoc = doc(this.firestore, `bancas/${id}`);
    return deleteDoc(bancaDoc);
  }
}
