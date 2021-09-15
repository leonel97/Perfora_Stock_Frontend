import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {TypeFournisseur} from "../../../models/gestion/definition/typeFournisseur";


@Injectable({
  providedIn: 'root'
})
export class TypeFournisseurService {

  url: string = environment.backend2 + '/commune/categorieFrs';
  private jwtTocken = null;

  constructor(private http: HttpClient) { this.jwtTocken = localStorage.getItem('token'); }

  createTypeFournisseur(typeFournisseur: TypeFournisseur): Observable<Object> {
    return this.http.post(`${this.url}/list`, typeFournisseur, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  addAListTypeFournisseur(corps: TypeFournisseur[]){
    return this.http.post<TypeFournisseur[]>(`${this.url}/list2`, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }


  deleteTypeFournisseur(id: String): Observable<Object> {
    return this.http.delete(`${this.url}/byCodCatFrs/`+ id, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  updateTypeFournisseur(id : String, typeFournisseur: TypeFournisseur): Observable<Object> {
    return this.http.put(`${this.url}/byCodCatFrs/${id}`, typeFournisseur, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  list(): Observable<Object> {
    return this.http.get(`${this.url}/list`, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

}
