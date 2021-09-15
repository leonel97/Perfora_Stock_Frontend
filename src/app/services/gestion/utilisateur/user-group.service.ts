import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserGroup} from "../../../models/gestion/utilisateur/user-group";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserGroupService {

  host: string = environment.backend2 +'/commune/gro';
  url: string = environment.backend + '/groupes';
  private jwtTocken = null;

  constructor(private http: HttpClient) { this.jwtTocken = localStorage.getItem('token'); }

  createUserGroup(userGroup: UserGroup): Observable<Object> {
    return this.http.post(`${this.host}/list`, userGroup, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  deleteUserGroup(id: number): Observable<Object> {
    return this.http.delete(`${this.host}/byid/${id}`, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  updateUserGroup(id : String, userGroup: UserGroup): Observable<Object> {
    return this.http.put(`${this.host}/byid/${id}`, userGroup, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  list(): Observable<Object> {
    return this.http.get(`${this.host}/list`, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

}
