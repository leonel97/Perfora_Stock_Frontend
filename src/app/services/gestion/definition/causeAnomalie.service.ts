import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CauseAnomalie} from "../../../models/gestion/definition/causeAnomalie";


@Injectable({
  providedIn: 'root'
})
export class CauseAnomalieService {

  url: string = environment.backend2 + '/commune/causeAnomalie';

  constructor(private http: HttpClient) { }

  createCauseAnomalie(causeAnomalie: CauseAnomalie): Observable<Object> {
    return this.http.post(`${this.url}/list`, causeAnomalie);
  }

  deleteCauseAnomalie(id: String): Observable<Object> {
    return this.http.delete(`${this.url}/byCodCauAno/`+ id);
  }

  updateCauseAnomalie(id : String, causeAnomalie: CauseAnomalie): Observable<Object> {
    return this.http.put(`${this.url}/byCodCauAno/${id}`, causeAnomalie);
  }

  list(): Observable<Object> {
    return this.http.get(`${this.url}/list`);
  }

}
