import { Injectable } from '@angular/core';

// Importações do SDK Modular do Firestore
import {
  Firestore, // O serviço principal do Firestore
  collection, // Para obter uma referência a uma coleção
  doc, // Para obter uma referência a um documento
  collectionData, // Para obter dados de uma coleção como Observable
  docData, // Para obter dados de um documento como Observable
  addDoc, // Para adicionar um novo documento
  updateDoc, // Para atualizar um documento
  deleteDoc, // Para deletar um documento
  query, // Para construir consultas (ex: ordenar)
  orderBy // Para ordenar resultados
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

// Interface para o nosso item
export interface Item {
  id?: string;
  name: string;
  description: string;
  createdAt?: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

   constructor(private firestore: Firestore){
   }

  // Retorna todos os itens
  getItems(): Observable<Item[]> {
    // Cria uma referência para a coleção 'items'
    const itemsCollectionRef = collection(this.firestore, 'items');
    // Cria uma query para ordenar por 'createdAt' em ordem decrescente
    const q = query(itemsCollectionRef, orderBy('createdAt', 'desc'));
    // Retorna os dados da coleção como um Observable, incluindo o ID do documento
    return collectionData(q, { idField: 'id' }) as Observable<Item[]>;
  }

  // Retorna um item específico pelo ID
  getItem(id: string): Observable<Item | undefined> {
    // Cria uma referência para o documento específico
    const itemDocRef = doc(this.firestore, `items/${id}`);
    // Retorna os dados do documento como um Observable, incluindo o ID do documento
    return docData(itemDocRef, { idField: 'id' }) as Observable<Item | undefined>;
  }

  // Adiciona um novo item
  addItem(item: Item) {
    const itemsCollectionRef = collection(this.firestore, 'items');
    // Adiciona um novo documento à coleção
    return addDoc(itemsCollectionRef, { ...item, createdAt: Date.now() });
  }

  // Atualiza um item existente
  updateItem(item: Item) {
    // Cria uma referência para o documento específico
    const itemDocRef = doc(this.firestore, `items/${item.id}`);
    // Atualiza o documento
    return updateDoc(itemDocRef, { name: item.name, description: item.description });
  }

  // Deleta um item pelo ID
  deleteItem(id: string) {
    // Cria uma referência para o documento específico
    const itemDocRef = doc(this.firestore, `items/${id}`);
    // Deleta o documento
    return deleteDoc(itemDocRef);
  }
}
