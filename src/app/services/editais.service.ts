import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, deleteDoc, doc, updateDoc, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditaisService {
  private collectionPath = 'editais';

  constructor(private firestore: Firestore) {}

  getEditais(): Observable<any[]> {
    const editalCollection = collection(this.firestore, this.collectionPath);
    return collectionData(editalCollection, { idField: 'id' });
  }

  addEdital(edital: { titulo: string; descricao: string; nome_banca: string, valor: string, link: string, vencimento: string, data_publicacao: string }) {
    const editalCollection = collection(this.firestore, this.collectionPath);
    return addDoc(editalCollection, edital);
  }

  updateEdital(id: string, edital: { titulo: string; descricao: string; nome_banca: string, valor: string, link: string, vencimento: string, data_publicacao: string }) {
    const editalDoc = doc(this.firestore, `${this.collectionPath}/${id}`);
    return updateDoc(editalDoc, edital);
  }

  deleteEdital(id: string) {
    const editalDoc = doc(this.firestore, `${this.collectionPath}/${id}`);
    return deleteDoc(editalDoc);
  }
}
