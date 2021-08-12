import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { StockComptaSetting } from 'src/app/models/gestion/comptabilisation/stockComptaSetting.model';


@Injectable({
  providedIn: 'root'
})
export class StockComptaSettingService {

  url: string = environment.backend2 + '/compta/stockComptaSetting';

  constructor(private http: HttpClient) { }

  createStockComptaSetting(stockComptaSetting: StockComptaSetting): Observable<Object> {
    return this.http.post(`${this.url}/list`, stockComptaSetting);
  }

  addAListStockComptaSetting(corps: StockComptaSetting[]){
    return this.http.post<StockComptaSetting[]>(`${this.url}/list2`, corps);
  }

  deleteStockComptaSetting(id: number): Observable<Object> {
    return this.http.delete(`${this.url}/byNum/`+ id);
  }

  updateStockComptaSetting(id : number, stockComptaSetting: StockComptaSetting): Observable<Object> {
    return this.http.put(`${this.url}/byNum/${id}`, stockComptaSetting);
  }

  list(): Observable<Object> {
    return this.http.get(`${this.url}/list`);
  }

}
