import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {CauseAnomalie} from "../../../models/gestion/definition/causeAnomalie";


@Injectable({
  providedIn: 'root'
})
export class CauseAnomalieService {

  url: string = environment.backend2 + '/commune/causeAnomalie';
  private jwtTocken = null;

  constructor(private http: HttpClient) { this.jwtTocken = localStorage.getItem('token'); }

  createCauseAnomalie(causeAnomalie: CauseAnomalie): Observable<Object> {
    return this.http.post(`${this.url}/list`, causeAnomalie, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  deleteCauseAnomalie(id: String): Observable<Object> {
    return this.http.delete(`${this.url}/byCodCauAno/`+ id, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  updateCauseAnomalie(id : String, causeAnomalie: CauseAnomalie): Observable<Object> {
    return this.http.put(`${this.url}/byCodCauAno/${id}`, causeAnomalie, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  list(): Observable<Object> {
    return this.http.get(`${this.url}/list`, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

}
