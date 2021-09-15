import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Civilite} from "../../../models/gestion/parametrage/civilite";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CiviliteService {

  host: string = environment.backend2 +'/commune/civilite';
  url: string = environment.backend + '/civilites';
  private jwtTocken = null;

  constructor(private http: HttpClient) { this.jwtTocken = localStorage.getItem('token'); }

  createCivilite(civilite: Civilite): Observable<Object> {
    return this.http.post(`${this.host}/list`, civilite, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  deleteCivilite(id: number): Observable<Object> {
    return this.http.delete(`${this.host}/byCodCiv/${id}`, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  updateCivilite(id: string, civilite: Civilite): Observable<Object> {
    return this.http.put(`${this.host}/byCodCiv/${id}`, civilite, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  list(): Observable<Object> {
    return this.http.get(`${this.host}/list`, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

}
