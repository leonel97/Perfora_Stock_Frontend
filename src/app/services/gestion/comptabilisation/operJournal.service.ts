import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import { OperationJournal } from 'src/app/models/gestion/comptabilisation/operJournal.model';


@Injectable({
  providedIn: 'root'
})
export class OperationJournalService {

  url: string = environment.backend2 + '/compta/opeJournalSetting';
  private jwtTocken = null;

  constructor(private http: HttpClient) { this.jwtTocken = localStorage.getItem('token'); }

  createOperationJournal(operationJournal: OperationJournal): Observable<Object> {
    return this.http.post(`${this.url}/list`, operationJournal, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  addAListOperationJournal(corps: OperationJournal[]){
    return this.http.post<OperationJournal[]>(`${this.url}/list2`, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  deleteOperationJournal(id: number): Observable<Object> {
    return this.http.delete(`${this.url}/byNum/`+ id, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  updateOperationJournal(id : number, operationJournal: OperationJournal): Observable<Object> {
    return this.http.put(`${this.url}/byNum/${id}`, operationJournal, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  list(): Observable<Object> {
    return this.http.get(`${this.url}/list`, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

}
