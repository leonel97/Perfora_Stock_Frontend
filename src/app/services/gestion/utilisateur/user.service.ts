import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../../../models/gestion/utilisateur/user";
import { EncapUserGroup } from 'src/app/models/gestion/saisie/encapsuleur-model/encapUserGroupe.model';
import { UserGroup } from 'src/app/models/gestion/utilisateur/user-group';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  
  host: string = environment.backend2 +'/commune/user';
  host1: string = environment.backend2 +'/commune/aug'; //aug/userGroup/{id}
  private jwtTocken = null;

  //url: string = environment.backend + '/users';

  constructor(private http: HttpClient) { this.jwtTocken = localStorage.getItem('token'); }

  createUser(user: User): Observable<Object> {
    return this.http.post(`${this.host}/list`, user, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }
  createUser2(corps:EncapUserGroup){
    return this.http.post<EncapUserGroup>(`${this.host}/list2`, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  createUser3(corps:User[]){
    return this.http.post<User[]>(`${this.host}/list3`, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  deleteUser(id: number): Observable<Object> {
    return this.http.delete(`${this.host}/byCodUser/${id}`, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  deleteUser2(code:String){
    return this.http.delete<boolean>(this.host+'/byCodUser2/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  updateUser2(code:String, corps:EncapUserGroup){
    return this.http.put<EncapUserGroup>(this.host+'/byCodUser2/'+code, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  updateUser(idUser: string, user: User): Observable<Object> {
    return this.http.put(`${this.host}/byCodUser/${idUser}`, user, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  list(): Observable<Object> {
    return this.http.get(`${this.host}/list`, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  getAllGroupUserForUser(id: number){
    return this.http.get(this.host1+'/userGroup/'+id, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

}
