import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {TypeEvenement} from "../../../models/gestion/parametrage/type-evenement";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TypeEvenementService {

  url: string = environment.backend + '/typeevenements';

  constructor(private http: HttpClient) { }

  createTypeEvenement(typeEvenement: TypeEvenement): Observable<Object> {
    return this.http.post(`${this.url}`, typeEvenement);
  }

  deleteTypeEvenement(id: number): Observable<Object> {
    return this.http.delete(`${this.url}/${id}`);
  }

  updateTypeEvenement(typeEvenement: TypeEvenement): Observable<Object> {
    return this.http.put(`${this.url}`, typeEvenement);
  }

  list(): Observable<Object> {
    return this.http.get(`${this.url}/?page=0&size=10000000`);
  }

}
