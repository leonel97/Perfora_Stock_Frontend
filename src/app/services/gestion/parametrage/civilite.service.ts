import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Civilite} from "../../../models/gestion/parametrage/civilite";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CiviliteService {

  url: string = environment.backend + '/civilites';

  constructor(private http: HttpClient) { }

  createCivilite(civilite: Civilite): Observable<Object> {
    return this.http.post(`${this.url}`, civilite);
  }

  deleteCivilite(id: number): Observable<Object> {
    return this.http.delete(`${this.url}/${id}`);
  }

  updateCivilite(civilite: Civilite): Observable<Object> {
    return this.http.put(`${this.url}`, civilite);
  }

  list(): Observable<Object> {
    return this.http.get(`${this.url}/?page=0&size=10000000`);
  }

}
