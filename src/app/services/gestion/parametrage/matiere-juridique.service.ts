import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {MatiereJuridique} from "../../../models/gestion/parametrage/matiere-juridique";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MatiereJuridiqueService {

  url: string = environment.backend + '/matieres';

  constructor(private http: HttpClient) { }

  createMatiere(matiereJuridique: MatiereJuridique): Observable<Object> {
    return this.http.post(`${this.url}`, matiereJuridique);
  }

  deleteLanguage(id: number): Observable<Object> {
    return this.http.delete(`${this.url}/${id}`);
  }

  updateMatiere(matiereJuridique: MatiereJuridique): Observable<Object> {
    return this.http.put(`${this.url}`, matiereJuridique);
  }

  list(): Observable<Object> {
    return this.http.get(`${this.url}/?page=0&size=10000000`);
  }

}
