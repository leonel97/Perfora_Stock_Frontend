import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Fournisseur} from "../../../models/gestion/definition/fournisseur";


@Injectable({
  providedIn: 'root'
})
export class FournisseurService {

  url: string = environment.backend2 + '/commune/fournisseur';
  private jwtTocken = null;

  constructor(private http: HttpClient) { this.jwtTocken = localStorage.getItem('token'); }

  createFournisseur(fournisseur: Fournisseur): Observable<Object> {
    return this.http.post(`${this.url}/list`, fournisseur, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  addAListFournisseur(corps: Fournisseur[]){
    return this.http.post<Fournisseur[]>(`${this.url}/list2`, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  deleteFournisseur(id: String): Observable<Object> {
    return this.http.delete(`${this.url}/byCodFou/`+ id, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  updateFournisseur(id : String, fournisseur: Fournisseur): Observable<Object> {
    return this.http.put(`${this.url}/byCodFou/${id}`, fournisseur, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  list(): Observable<Object> {
    return this.http.get(`${this.url}/list`, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

}
