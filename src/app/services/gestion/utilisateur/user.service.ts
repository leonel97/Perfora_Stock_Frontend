import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {User} from "../../../models/gestion/utilisateur/user";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  
  host: string = environment.backend2 +'/commune/user';

  //url: string = environment.backend + '/users';

  constructor(private http: HttpClient) { }

  createUser(user: User): Observable<Object> {
    return this.http.post(`${this.host}/list`, user);
  }

  deleteUser(id: number): Observable<Object> {
    return this.http.delete(`${this.host}/byCodUser/${id}`);
  }

  updateUser(idUser: string, user: User): Observable<Object> {
    return this.http.put(`${this.host}/byCodUser/${idUser}`, user);
  }

  list(): Observable<Object> {
    return this.http.get(`${this.host}/list`);
  }

}
