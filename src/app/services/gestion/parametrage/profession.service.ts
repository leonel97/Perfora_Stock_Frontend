import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profession } from '../../../models/gestion/parametrage/profession';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfessionService {

  host: string = environment.backend2 +'/commune/profession';
  url: string = environment.backend + '/professions';

  constructor(private http: HttpClient) { }

  createProfession(profession: Profession): Observable<Object> {
    return this.http.post(`${this.host}/list`, profession);
  }

  deleteProfession(id: number): Observable<Object> {
    return this.http.delete(`${this.host}/byCodPro/${id}`);
  }

  updateProfession(id: string, profession: Profession): Observable<Object> {
    return this.http.put(`${this.host}/byCodPro/${id}`, profession);
  }

  list(): Observable<Object> {
    return this.http.get(`${this.host}/list`);
  }

}
