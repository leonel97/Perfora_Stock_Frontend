import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CentreConsommation} from "../../../models/gestion/definition/centreConsommation";


@Injectable({
  providedIn: 'root'
})
export class CentreConsommationService {

  url: string = environment.backend2 + '/commune/service';

  constructor(private http: HttpClient) { }

  createCentreConsommation(centreConsommation: CentreConsommation): Observable<Object> {
    return this.http.post(`${this.url}/list`, centreConsommation);
  }

  deleteCentreConsommation(id: String): Observable<Object> {
    return this.http.delete(`${this.url}/byCodSev/`+ id);
  }

  updateCentreConsommation(id : String, centreConsommation: CentreConsommation): Observable<Object> {
    return this.http.put(`${this.url}/byCodSev/${id}`, centreConsommation);
  }

  list(): Observable<Object> {
    return this.http.get(`${this.url}/list`);
  }

}
