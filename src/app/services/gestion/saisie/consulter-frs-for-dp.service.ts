import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConsulterFrsForDp } from 'src/app/models/gestion/saisie/consulterFrsForDp.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConsulterFrsForDpService {

  host: string = environment.backend2;
  private jwtTocken = null;

  constructor(private httpCli: HttpClient) { this.jwtTocken = localStorage.getItem('token'); }

  //Partie réservé pour ConsulterFrsForDp

  getAllConsulterFrsForDp(){
    return this.httpCli.get<ConsulterFrsForDp[]>(this.host+'/stock/consulterFrsForDp/list', {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});

  }

  getConsulterFrsForDpById(code:String){
    return this.httpCli.get<ConsulterFrsForDp>(this.host+'/stock/consulterFrsForDp/byCodConFrsForDp/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  editAConsulterFrsForDp(code:String, corps:ConsulterFrsForDp){
    return this.httpCli.put<ConsulterFrsForDp>(this.host+'/stock/consulterFrsForDp/byCodConFrsForDp/'+code, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  addAConsulterFrsForDp(corps:ConsulterFrsForDp){
    return this.httpCli.post<ConsulterFrsForDp>(this.host+'/stock/consulterFrsForDp/list', corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  deleteAConsulterFrsForDp(code:String){
    return this.httpCli.delete<Boolean>(this.host+'/stock/consulterFrsForDp/byCodConFrsForDp/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }



}

