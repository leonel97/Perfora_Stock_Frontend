import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Evenement} from "../../../models/gestion/parametrage/evenement";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EvenementService {

  url: string = environment.backend + '/evenements';

  constructor(private http: HttpClient) { }

  createEvenement(evenement: Evenement): Observable<Object> {
    return this.http.post(`${this.url}`, evenement);
  }

  deleteEvenement(id: number): Observable<Object> {
    return this.http.delete(`${this.url}/${id}`);
  }

  updateEvenement(evenement: Evenement): Observable<Object> {
    return this.http.put(`${this.url}`, evenement);
  }

  list(): Observable<Object> {
    return this.http.get(`${this.url}/?page=0&size=10000000`);
  }

}
