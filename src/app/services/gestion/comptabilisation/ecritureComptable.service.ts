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

  constructor(private http: HttpClient) {}

  createEcritureComptable(ecritureComptable: EcritureComptable): Observable<Object> {
    return this.http.post(`${this.url}/list`, ecritureComptable); 
  }

  addAListEcritureComptable(corps: EcritureComptable[]){
    return this.http.post<EcritureComptable[]>(`${this.url}/list2`, corps);
  }

  deleteEcritureComptable(id: number): Observable<Object> {
    return this.http.delete(`${this.url}/byNum/`+ id);
  }

  updateEcritureComptable(id : number, ecritureComptable: EcritureComptable): Observable<Object> {
    return this.http.put(`${this.url}/byNum/${id}`, ecritureComptable);
  }

 /* list(): Observable<Object> {
    return this.http.get(`${this.url}/list`);
  }*/

  list(){
    return this.http.get<EcritureComptable[]>(`${this.url}/list`);
  }

}
