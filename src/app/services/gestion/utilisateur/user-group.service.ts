import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {UserGroup} from "../../../models/gestion/utilisateur/user-group";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserGroupService {

  host: string = environment.backend2 +'/commune/gro';
  url: string = environment.backend + '/groupes';

  constructor(private http: HttpClient) { }

  createUserGroup(userGroup: UserGroup): Observable<Object> {
    return this.http.post(`${this.host}/list`, userGroup);
  }

  deleteUserGroup(id: number): Observable<Object> {
    return this.http.delete(`${this.host}/byid/${id}`);
  }

  updateUserGroup(id : String, userGroup: UserGroup): Observable<Object> {
    return this.http.put(`${this.host}/byid/${id}`, userGroup);
  }

  list(): Observable<Object> {
    return this.http.get(`${this.host}/list`);
  }

}
