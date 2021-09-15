import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profession } from '../../../models/gestion/parametrage/profession';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfessionService {

  host: string = environment.backend2 +'/commune/profession';
  url: string = environment.backend + '/professions';
  private jwtTocken = null;

  constructor(private http: HttpClient) { this.jwtTocken = localStorage.getItem('token'); }

  createProfession(profession: Profession): Observable<Object> {
    return this.http.post(`${this.host}/list`, profession, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  deleteProfession(id: number): Observable<Object> {
    return this.http.delete(`${this.host}/byCodPro/${id}`, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  updateProfession(id: string, profession: Profession): Observable<Object> {
    return this.http.put(`${this.host}/byCodPro/${id}`, profession, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  list(): Observable<Object> {
    return this.http.get(`${this.host}/list`, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

}
