import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {TypePartie} from "../../../models/gestion/parametrage/type-partie";

@Injectable({
  providedIn: 'root'
})
export class TypePartieService {

  url: string = environment.backend + '/type-parties';

  constructor(private http: HttpClient) { }

  createTypePartie(typePartie: TypePartie): Observable<Object> {
    return this.http.post(`${this.url}`, typePartie);
  }

  deleteTypePartie(id: number): Observable<Object> {
    return this.http.delete(`${this.url}/${id}`);
  }

  updateTypePartie(typePartie: TypePartie): Observable<Object> {
    return this.http.put(`${this.url}`, typePartie);
  }

  list(): Observable<Object> {
    return this.http.get(`${this.url}/?page=0&size=10000000`);
  }

}
