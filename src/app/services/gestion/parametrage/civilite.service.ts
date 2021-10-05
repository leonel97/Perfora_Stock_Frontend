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
  constructor(private http: HttpClient) {  }

  createCivilite(civilite: Civilite): Observable<Object> {
    return this.http.post(`${this.host}/list`, civilite);
  }

  deleteCivilite(id: number): Observable<Object> {
    return this.http.delete(`${this.host}/byCodCiv/${id}`);
  }

  updateCivilite(id: string, civilite: Civilite): Observable<Object> {
    return this.http.put(`${this.host}/byCodCiv/${id}`, civilite);
  }

  list(): Observable<Object> {
    return this.http.get(`${this.host}/list`);
  }

}
