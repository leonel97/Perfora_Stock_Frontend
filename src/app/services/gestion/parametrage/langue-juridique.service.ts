import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {LangueJuridique} from "../../../models/gestion/parametrage/langue-juridique";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LangueJuridiqueService {

  url: string = environment.backend + '/langues';

  constructor(private http: HttpClient) { }

  createLangue(langueJuridique: LangueJuridique): Observable<Object> {
    return this.http.post(`${this.url}`, langueJuridique);
  }

  deleteLanguage(id: number): Observable<Object> {
    return this.http.delete(`${this.url}/${id}`);
  }

  updateLangue(langueJuridique: LangueJuridique): Observable<Object> {
    return this.http.put(`${this.url}`, langueJuridique);
  }

  list(): Observable<Object> {
    return this.http.get(`${this.url}/?page=0&size=10000000`);
  }

}
