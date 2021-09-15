import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import { StockComptaSetting } from 'src/app/models/gestion/comptabilisation/stockComptaSetting.model';


@Injectable({
  providedIn: 'root'
})
export class StockComptaSettingService {

  url: string = environment.backend2 + '/compta/stockComptaSetting';
  private jwtTocken = null;

  constructor(private http: HttpClient) { this.jwtTocken = localStorage.getItem('token'); }

  createStockComptaSetting(stockComptaSetting: StockComptaSetting): Observable<Object> {
    return this.http.post(`${this.url}/list`, stockComptaSetting, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  addAListStockComptaSetting(corps: StockComptaSetting[]){
    return this.http.post<StockComptaSetting[]>(`${this.url}/list2`, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  deleteStockComptaSetting(id: number): Observable<Object> {
    return this.http.delete(`${this.url}/byNum/`+ id, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  updateStockComptaSetting(id : number, stockComptaSetting: StockComptaSetting): Observable<Object> {
    return this.http.put(`${this.url}/byNum/${id}`, stockComptaSetting, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

 /* list(): Observable<Object> {
    return this.http.get(`${this.url}/list`);
  }*/

  list(){
    return this.http.get<StockComptaSetting[]>(`${this.url}/list`, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

}
