import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {TypeFournisseur} from "../../../models/gestion/definition/typeFournisseur";


@Injectable({
  providedIn: 'root'
})
export class TypeFournisseurService {

  url: string = environment.backend2 + '/commune/categorieFrs';

  constructor(private http: HttpClient) { }

  createTypeFournisseur(typeFournisseur: TypeFournisseur): Observable<Object> {
    return this.http.post(`${this.url}/list`, typeFournisseur);
  }

  deleteTypeFournisseur(id: String): Observable<Object> {
    return this.http.delete(`${this.url}/byCodCatFrs/`+ id);
  }

  updateTypeFournisseur(id : String, typeFournisseur: TypeFournisseur): Observable<Object> {
    return this.http.put(`${this.url}/byCodCatFrs/${id}`, typeFournisseur);
  }

  list(): Observable<Object> {
    return this.http.get(`${this.url}/list`);
  }

}
