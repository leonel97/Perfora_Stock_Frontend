import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {LangueJuridique} from "../../../models/gestion/parametrage/langue-juridique";
import {Observable} from "rxjs";
import {RoleAuxiliaire} from "../../../models/gestion/parametrage/role-auxiliaire";

@Injectable({
  providedIn: 'root'
})
export class RoleAuxiliaireService {

  url: string = environment.backend + '/roleauxilliaires';

  constructor(private http: HttpClient) { }

  createRoleAuxiliaire(roleAuxiliaire: RoleAuxiliaire): Observable<Object> {
    return this.http.post(`${this.url}`, roleAuxiliaire);
  }

  deleteRoleAuxiliaire(id: number): Observable<Object> {
    return this.http.delete(`${this.url}/${id}`);
  }

  updateRoleAuxiliaire(roleAuxiliaire: RoleAuxiliaire): Observable<Object> {
    return this.http.put(`${this.url}`, roleAuxiliaire);
  }

  list(): Observable<Object> {
    return this.http.get(`${this.url}/?page=0&size=10000000`);
  }

}
