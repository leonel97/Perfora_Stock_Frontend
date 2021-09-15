import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Fonction} from "../../../models/gestion/parametrage/fonction";

@Injectable({
  providedIn: 'root'
})
export class FonctionService {

  host: string = environment.backend2 +'/commune/fonction';
  url: string = environment.backend + '/fonctions';
  private jwtTocken = null;

  constructor(private http: HttpClient) { this.jwtTocken = localStorage.getItem('token'); }

  createFonction(fonction: Fonction): Observable<Object> {
    return this.http.post(`${this.host}/list`, fonction, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  deleteFonction(id: number): Observable<Object> {
    return this.http.delete(`${this.host}/byCodFon/${id}`, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  updateFonction(id: string, fonction: Fonction): Observable<Object> {
    return this.http.put(`${this.host}/byCodFon/${id}`, fonction, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  list(): Observable<Object> {
    return this.http.get(`${this.host}/list`, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

}
