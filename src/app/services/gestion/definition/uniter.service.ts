import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Uniter } from 'src/app/models/gestion/definition/uniter.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UniterService {

  host: string = environment.backend2;
  private jwtTocken = null;

  constructor(private httpCli: HttpClient) { this.jwtTocken = localStorage.getItem('token'); }

  //Partie réservé pour les Unités
  getAllUniter(){
    return this.httpCli.get<Uniter[]>(this.host+'/stock/uniter/list', {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});

  }

  getUniterById(code:String){
    return this.httpCli.get<Uniter>(this.host+'/stock/uniter/byCodUni/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  editAUniter(code:String, corps:Uniter){
    return this.httpCli.put<Uniter>(this.host+'/stock/uniter/byCodUni/'+code, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  addAUniter(corps:Uniter){
    return this.httpCli.post<Uniter>(this.host+'/stock/uniter/list', corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  addAListUniter(corps:Uniter[]){
    return this.httpCli.post<Uniter[]>(this.host+'/stock/uniter/list2', corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  deleteAUniter(code:String){
    return this.httpCli.delete<Boolean>(this.host+'/stock/uniter/byCodUni/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }


}
