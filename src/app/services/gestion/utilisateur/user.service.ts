import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {User} from "../../../models/gestion/utilisateur/user";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url: string = environment.backend + '/users';

  constructor(private http: HttpClient) { }

  createUser(user: User): Observable<Object> {
    return this.http.post(`${this.url}`, user);
  }

  deleteUser(id: number): Observable<Object> {
    return this.http.delete(`${this.url}/${id}`);
  }

  updateUser(user: User): Observable<Object> {
    return this.http.put(`${this.url}`, user);
  }

  list(): Observable<Object> {
    return this.http.get(`${this.url}/?page=0&size=10000000`);
  }

}
