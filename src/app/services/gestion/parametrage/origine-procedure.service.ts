import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrigineProcedure } from 'src/app/models/gestion/parametrage/origine-procedure';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrigineProcedureService {

  url: string = environment.backend + '/origine-procedures';

  constructor(private http: HttpClient) { }

  createOrigineProcedure(origineProcedure: OrigineProcedure): Observable<Object> {
    return this.http.post(`${this.url}`, origineProcedure);
  }

  deleteOrigineProcedure(id: number): Observable<Object> {
    return this.http.delete(`${this.url}/${id}`);
  }

  updateOrigineProcedure(origineProcedure: OrigineProcedure): Observable<Object> {
    return this.http.put(`${this.url}`, origineProcedure);
  }

  list(): Observable<Object> {
    return this.http.get(`${this.url}/?page=0&size=10000000`);
  }
}
