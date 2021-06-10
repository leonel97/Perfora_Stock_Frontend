import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {LangueJuridique} from "../../../models/gestion/parametrage/langue-juridique";
import {Observable} from "rxjs";
import {Fonction} from "../../../models/gestion/parametrage/fonction";

@Injectable({
  providedIn: 'root'
})
export class FonctionService {

  url: string = environment.backend + '/fonctions';

  constructor(private http: HttpClient) { }

  createFonction(fonction: Fonction): Observable<Object> {
    return this.http.post(`${this.url}`, fonction);
  }

  deleteFonction(id: number): Observable<Object> {
    return this.http.delete(`${this.url}/${id}`);
  }

  updateFonction(fonction: Fonction): Observable<Object> {
    return this.http.put(`${this.url}`, fonction);
  }

  list(): Observable<Object> {
    return this.http.get(`${this.url}/?page=0&size=10000000`);
  }

}
