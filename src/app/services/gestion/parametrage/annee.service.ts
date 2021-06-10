import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Annee} from "../../../models/gestion/parametrage/annee";

@Injectable({
  providedIn: 'root'
})
export class AnneeService {

  url: string = environment.backend + '/annees';

  constructor(private http: HttpClient) { }

  createAnnee(annee: Annee): Observable<Object> {
    return this.http.post(`${this.url}`, annee);
  }

  deleteAnnee(id: number): Observable<Object> {
    return this.http.delete(`${this.url}/${id}`);
  }

  updateAnnee(annee: Annee): Observable<Object> {
    return this.http.put(`${this.url}`, annee);
  }

  list(): Observable<Object> {
    return this.http.get(`${this.url}/?page=0&size=10000000`);
  }

}
