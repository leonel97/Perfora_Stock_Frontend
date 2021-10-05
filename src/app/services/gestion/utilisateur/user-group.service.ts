import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserGroup} from "../../../models/gestion/utilisateur/user-group";
import { EncapGroupDroits } from 'src/app/models/gestion/saisie/encapsuleur-model/encapGroupeDroit.model';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserGroupService {

  host: string = environment.backend2 +'/commune/gro';
  //url: string = environment.backend + '/groupes';
  host1 : string = environment.backend2 +'/commune/du';

  constructor(private http: HttpClient) {}

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

  //list des droits users
  listDroitUser(): Observable<Object> {
    return this.http.get(`${this.host1}/list`);
  }

  //GroupDroits
  createGroupDroits(corps:EncapGroupDroits){
    return this.http.post<EncapGroupDroits>(`${this.host}/list2`, corps);
  }

  updateGroupDroits(code:String, corps:EncapGroupDroits){
    return this.http.put<EncapGroupDroits>(this.host+'/byid2/'+code, corps);
  }

  deleteGroupDroits(code:String){
    return this.http.delete<boolean>(this.host+'/byid2/'+code);
  }

  getAllDroitUserForGroupUser(id: number){
    return this.http.get(this.host+'/byGroupUserId/'+id);
  }

}
