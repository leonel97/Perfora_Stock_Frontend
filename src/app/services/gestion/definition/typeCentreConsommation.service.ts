import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {TypeCentreConsommation} from "../../../models/gestion/definition/typeCentreConsommation";


@Injectable({
  providedIn: 'root'
})
export class TypeCentreConsommationService {

  url: string = environment.backend2 + '/commune/typeService';
  private jwtTocken = null;

  constructor(private http: HttpClient) { this.jwtTocken = localStorage.getItem('token'); }

  createTypecentreConsommation(typecentreconsommation: TypeCentreConsommation): Observable<Object> {
    return this.http.post(`${this.url}/list`, typecentreconsommation, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  addAListTypeCentreConsommation(corps: TypeCentreConsommation[]){
    return this.http.post<TypeCentreConsommation[]>(`${this.url}/list2`, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  deleteTypecentreConsommation(id: String): Observable<Object> {
    return this.http.delete(`${this.url}/byCodTypSer/`+ id, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  updateTypecentreConsommation(id : String, typecentreconsommation: TypeCentreConsommation): Observable<Object> {
    return this.http.put(`${this.url}/byCodTypSer/${id}`, typecentreconsommation, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  list(): Observable<Object> {
    return this.http.get(`${this.url}/list`, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

}
