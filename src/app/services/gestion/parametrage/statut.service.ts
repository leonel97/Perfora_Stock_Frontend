import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Statut} from "../../../models/gestion/parametrage/statut";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StatutService {

  url: string = environment.backend + '/statuts';

  constructor(private http: HttpClient) { }

  createStatut(statut: Statut): Observable<Object> {
    return this.http.post(`${this.url}`, statut);
  }

  deleteStatut(id: number): Observable<Object> {
    return this.http.delete(`${this.url}/${id}`);
  }

  updateStatut(statut: Statut): Observable<Object> {
    return this.http.put(`${this.url}`, statut);
  }

  list(): Observable<Object> {
    return this.http.get(`${this.url}/?page=0&size=10000000`);
  }

}
