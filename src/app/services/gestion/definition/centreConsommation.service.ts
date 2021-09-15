import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {CentreConsommation} from "../../../models/gestion/definition/centreConsommation";


@Injectable({
  providedIn: 'root'
})
export class CentreConsommationService {

  url: string = environment.backend2 + '/commune/service';
  private jwtTocken = null;

  constructor(private http: HttpClient) { this.jwtTocken = localStorage.getItem('token'); }

  createCentreConsommation(centreConsommation: CentreConsommation): Observable<Object> {
    return this.http.post(`${this.url}/list`, centreConsommation, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  addAListCentreConsommation(corps: CentreConsommation[]){
    return this.http.post<CentreConsommation[]>(`${this.url}/list2`, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  deleteCentreConsommation(id: String): Observable<Object> {
    return this.http.delete(`${this.url}/byCodSev/`+ id, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  updateCentreConsommation(id : String, centreConsommation: CentreConsommation): Observable<Object> {
    return this.http.put(`${this.url}/byCodSev/${id}`, centreConsommation, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  list(): Observable<Object> {
    return this.http.get(`${this.url}/list`, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

}
