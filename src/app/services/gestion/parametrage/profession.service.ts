import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profession } from '../../../models/gestion/parametrage/profession';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfessionService {
  url: string = environment.backend + '/professions';

  constructor(private http: HttpClient) { }

  createProfession(profession: Profession): Observable<Object> {
    return this.http.post(`${this.url}`, profession);
  }

  deleteProfession(id: number): Observable<Object> {
    return this.http.delete(`${this.url}/${id}`);
  }

  updateProfession(profession: Profession): Observable<Object> {
    return this.http.put(`${this.url}`, profession);
  }

  list(): Observable<Object> {
    return this.http.get(`${this.url}/?page=0&size=10000000`);
  }

}
