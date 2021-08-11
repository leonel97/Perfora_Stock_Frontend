import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { OperationJournal } from 'src/app/models/gestion/comptabilisation/operJournal.model';


@Injectable({
  providedIn: 'root'
})
export class OperationJournalService {

  url: string = environment.backend2 + '/compta/opeJournalSetting';

  constructor(private http: HttpClient) { }

  createOperationJournal(operationJournal: OperationJournal): Observable<Object> {
    return this.http.post(`${this.url}/list`, operationJournal);
  }

  addAListOperationJournal(corps: OperationJournal[]){
    return this.http.post<OperationJournal[]>(`${this.url}/list2`, corps);
  }

  deleteOperationJournal(id: number): Observable<Object> {
    return this.http.delete(`${this.url}/byNum/`+ id);
  }

  updateOperationJournal(id : number, operationJournal: OperationJournal): Observable<Object> {
    return this.http.put(`${this.url}/byNum/${id}`, operationJournal);
  }

  list(): Observable<Object> {
    return this.http.get(`${this.url}/list`);
  }

}
