import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {TypeCentreConsommation} from "../../../models/gestion/definition/typeCentreConsommation";


@Injectable({
  providedIn: 'root'
})
export class TypeCentreConsommationService {

  url: string = environment.backend2 + '/commune/typeService';

  constructor(private http: HttpClient) { }

  createTypecentreConsommation(typecentreconsommation: TypeCentreConsommation): Observable<Object> {
    return this.http.post(`${this.url}/list`, typecentreconsommation);
  }

  deleteTypecentreConsommation(id: String): Observable<Object> {
    return this.http.delete(`${this.url}/byCodTypSer/`+ id);
  }

  updateTypecentreConsommation(id : String, typecentreconsommation: TypeCentreConsommation): Observable<Object> {
    return this.http.put(`${this.url}/byCodTypSer/${id}`, typecentreconsommation);
  }

  list(): Observable<Object> {
    return this.http.get(`${this.url}/list`);
  }

}
