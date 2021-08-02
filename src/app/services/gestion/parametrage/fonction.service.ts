import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Fonction} from "../../../models/gestion/parametrage/fonction";

@Injectable({
  providedIn: 'root'
})
export class FonctionService {

  host: string = environment.backend2 +'/commune/fonction';
  url: string = environment.backend + '/fonctions';

  constructor(private http: HttpClient) { }

  createFonction(fonction: Fonction): Observable<Object> {
    return this.http.post(`${this.host}/list`, fonction);
  }

  deleteFonction(id: number): Observable<Object> {
    return this.http.delete(`${this.host}/byCodFon/${id}`);
  }

  updateFonction(id: string, fonction: Fonction): Observable<Object> {
    return this.http.put(`${this.host}/byCodFon/${id}`, fonction);
  }

  list(): Observable<Object> {
    return this.http.get(`${this.host}/list`);
  }

}
