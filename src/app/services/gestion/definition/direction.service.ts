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

  constructor(private http: HttpClient) {  }

  createDirection(direction: Direction): Observable<Object> {
    return this.http.post(`${this.url}/list`, direction);
  }

  addAListDirection(corps: Direction[]){
    return this.http.post<Direction[]>(`${this.url}/list2`, corps);
  }

  deleteDirection(id: String): Observable<Object> {
    return this.http.delete(`${this.url}/byCodDir/`+ id);
  }

  updateDirection(id : String, direction: Direction): Observable<Object> {
    return this.http.put(`${this.url}/byCodDir/${id}`, direction);
  }

  list(): Observable<Object> {
    return this.http.get(`${this.url}/list`);
  }

}
