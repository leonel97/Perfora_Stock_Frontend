import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../../../models/gestion/utilisateur/user";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  
  host: string = environment.backend2 +'/commune/user';
  private jwtTocken = null;

  //url: string = environment.backend + '/users';

  constructor(private http: HttpClient) { this.jwtTocken = localStorage.getItem('token'); }

  createUser(user: User): Observable<Object> {
    return this.http.post(`${this.host}/list`, user, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  deleteUser(id: number): Observable<Object> {
    return this.http.delete(`${this.host}/byCodUser/${id}`, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  updateUser(idUser: string, user: User): Observable<Object> {
    return this.http.put(`${this.host}/byCodUser/${idUser}`, user, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  list(): Observable<Object> {
    return this.http.get(`${this.host}/list`, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

}
