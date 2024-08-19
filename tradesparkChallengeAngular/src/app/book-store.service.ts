import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookStoreService {

  constructor(private client: HttpClient) { }

  getBooks() {
    return this.client.get('http://localhost:8000/bookStore/books/')
  }


  deleteCategoryFromBook(id: number , title: string, category: string, category_id: number): Observable<any> {
    const req = { id, title, category , category_id};
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    return this.client.post('http://localhost:8000/bookStore/books/delete-category/', req, {headers});
    
  }
}
