import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Adresse } from 'src/app/models/gestion/adresse/adresse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdresseService {
  url: string = environment.backend + '/adresses';

  constructor(private http: HttpClient) { }

  createAdresse(adresse: Adresse): Observable<Object> {
    return this.http.post(`${this.url}`, adresse);
  }

  deleteAdresse(id: number): Observable<Object> {
    return this.http.delete(`${this.url}/${id}`);
  }

  updateAdresse(adresse: Adresse): Observable<Object> {
    return this.http.put(`${this.url}`, adresse);
  }

  list(): Observable<Object> {
    return this.http.get(`${this.url}/?page=0&size=10000000`);
  }
}
