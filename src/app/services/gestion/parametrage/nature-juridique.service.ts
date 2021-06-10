import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {LangueJuridique} from "../../../models/gestion/parametrage/langue-juridique";
import {Observable} from "rxjs";
import {NatureJuridique} from "../../../models/gestion/parametrage/nature-juridique";

@Injectable({
  providedIn: 'root'
})
export class NatureJuridiqueService {

  url: string = environment.backend + '/naturejuridiques';

  constructor(private http: HttpClient) { }

  createNatureJuridique(natureJuridique: NatureJuridique): Observable<Object> {
    return this.http.post(`${this.url}`, natureJuridique);
  }

  deleteNatureJuridique(id: number): Observable<Object> {
    return this.http.delete(`${this.url}/${id}`);
  }

  updateNatureJuridique(natureJuridique: NatureJuridique): Observable<Object> {
    return this.http.put(`${this.url}`, natureJuridique);
  }

  list(): Observable<Object> {
    return this.http.get(`${this.url}/?page=0&size=10000000`);
  }

}
