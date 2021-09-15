import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import { EcritureComptable } from 'src/app/models/gestion/comptabilisation/ecritureComptable.model';


@Injectable({
  providedIn: 'root'
})
export class EcritureComptableService {

  url: string = environment.backend2 + '/compta/ecritureComptable';
  private jwtTocken = null;

  constructor(private http: HttpClient) { this.jwtTocken = localStorage.getItem('token'); }

  createEcritureComptable(ecritureComptable: EcritureComptable): Observable<Object> {
    return this.http.post(`${this.url}/list`, ecritureComptable, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})}); 
  }

  addAListEcritureComptable(corps: EcritureComptable[]){
    return this.http.post<EcritureComptable[]>(`${this.url}/list2`, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  deleteEcritureComptable(id: number): Observable<Object> {
    return this.http.delete(`${this.url}/byNum/`+ id, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  updateEcritureComptable(id : number, ecritureComptable: EcritureComptable): Observable<Object> {
    return this.http.put(`${this.url}/byNum/${id}`, ecritureComptable, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

 /* list(): Observable<Object> {
    return this.http.get(`${this.url}/list`);
  }*/

  list(){
    return this.http.get<EcritureComptable[]>(`${this.url}/list`, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

}
