import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {UserGroup} from "../../../models/gestion/utilisateur/user-group";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserGroupService {

  url: string = environment.backend + '/groupes';

  constructor(private http: HttpClient) { }

  createUserGroup(userGroup: UserGroup): Observable<Object> {
    return this.http.post(`${this.url}`, userGroup);
  }

  deleteUserGroup(id: number): Observable<Object> {
    return this.http.delete(`${this.url}/${id}`);
  }

  updateUserGroup(userGroup: UserGroup): Observable<Object> {
    return this.http.put(`${this.url}`, userGroup);
  }

  list(): Observable<Object> {
    return this.http.get(`${this.url}/?page=0&size=10000000`);
  }

}
