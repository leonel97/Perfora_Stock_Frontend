import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Direction} from "../../../models/gestion/definition/direction";


@Injectable({
  providedIn: 'root'
})
export class DirectionService {

  url: string = environment.backend2 + '/commune/direction';
  private jwtTocken = null;

  constructor(private http: HttpClient) {  this.jwtTocken = localStorage.getItem('token');}

  createDirection(direction: Direction): Observable<Object> {
    return this.http.post(`${this.url}/list`, direction, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  addAListDirection(corps: Direction[]){
    return this.http.post<Direction[]>(`${this.url}/list2`, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  deleteDirection(id: String): Observable<Object> {
    return this.http.delete(`${this.url}/byCodDir/`+ id, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  updateDirection(id : String, direction: Direction): Observable<Object> {
    return this.http.put(`${this.url}/byCodDir/${id}`, direction, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  list(): Observable<Object> {
    return this.http.get(`${this.url}/list`, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

}
