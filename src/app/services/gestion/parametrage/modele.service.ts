import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Modele } from '../../../models/gestion/parametrage/modele';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModeleService {

  url: string = environment.backend + '/modeles';

  constructor(private http: HttpClient) { }

  createModele(modele: Modele): Observable<Object> {
    return this.http.post(`${this.url}`, modele);
  }

  deleteModele(id: number): Observable<Object> {
    return this.http.delete(`${this.url}/${id}`);
  }

  updateModele(modele: Modele): Observable<Object> {
    return this.http.put(`${this.url}`, modele);
  }

  list(): Observable<Object> {
    return this.http.get(`${this.url}/?page=0&size=10000000`);
  }

}
