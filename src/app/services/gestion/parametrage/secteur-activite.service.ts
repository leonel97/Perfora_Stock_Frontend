import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {LangueJuridique} from "../../../models/gestion/parametrage/langue-juridique";
import {Observable} from "rxjs";
import {SecteurActivite} from "../../../models/gestion/parametrage/secteur-activite";

@Injectable({
  providedIn: 'root'
})
export class SecteurActiviteService {

  url: string = environment.backend + '/secteuractivites';

  constructor(private http: HttpClient) { }

  createSecteurActivite(secteurActivite: SecteurActivite): Observable<Object> {
    return this.http.post(`${this.url}`, secteurActivite);
  }

  deleteSecteurActivite(id: number): Observable<Object> {
    return this.http.delete(`${this.url}/${id}`);
  }

  updateSecteurActivite(secteurActivite: SecteurActivite): Observable<Object> {
    return this.http.put(`${this.url}`, secteurActivite);
  }

  list(): Observable<Object> {
    return this.http.get(`${this.url}/?page=0&size=10000000`);
  }

}
