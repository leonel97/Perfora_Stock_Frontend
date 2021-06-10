import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Relation} from "../../../models/gestion/parametrage/relation";
import {Observable} from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class RelationService {

  url: string = environment.backend + '/relations';

  constructor(private http: HttpClient) { }

  createRelation(relation: Relation): Observable<Object> {
    return this.http.post(`${this.url}`, relation);
  }

  deleteRelation(id: number): Observable<Object> {
    return this.http.delete(`${this.url}/${id}`);
  }

  updateRelation(relation: Relation): Observable<Object> {
    return this.http.put(`${this.url}`, relation);
  }

  list(): Observable<Object> {
    return this.http.get(`${this.url}/?page=0&size=10000000`);
  }

}
