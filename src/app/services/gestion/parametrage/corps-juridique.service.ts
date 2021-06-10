import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {CorpsJuridique} from "../../../models/gestion/parametrage/corps-juridique";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CorpsJuridiqueService {

  url: string = environment.backend + '/corps';

  constructor(private http: HttpClient) { }

  createCorps(corpsJuridique: CorpsJuridique): Observable<Object> {
    return this.http.post(`${this.url}`, corpsJuridique);
  }

  deleteCorps(id: number): Observable<Object> {
    return this.http.delete(`${this.url}/${id}`);
  }

  updateCorps(corpsJuridique: CorpsJuridique): Observable<Object> {
    return this.http.put(`${this.url}`, corpsJuridique);
  }

  list(): Observable<Object> {
    return this.http.get(`${this.url}/?page=0&size=10000000`);
  }

}
