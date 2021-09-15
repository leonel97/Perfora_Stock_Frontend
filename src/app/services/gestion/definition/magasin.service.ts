import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Magasin } from 'src/app/models/gestion/definition/magasin.model';
import { environment } from 'src/environments/environment';
import {AuthService} from "../../../services/common/auth.service";

@Injectable({
  providedIn: 'root'
})
export class MagasinService {

  host: string = environment.backend2;

  private jwtTocken = null;

  constructor(private httpCli: HttpClient,
    private auth: AuthService) {
      this.jwtTocken = localStorage.getItem('token');
     }

  //Partie réservée Magasin
  getAllMagasin(){
   
    return this.httpCli.get<Magasin[]>(this.host+'/stock/magasin/list', {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  getAMagasinById(code:String){
    return this.httpCli.get<Magasin>(this.host+'/stock/magasin/byCodMag/'+code,  {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  addAMagasin(corps:Magasin){
   return this.httpCli.post<Magasin>(this.host+'/stock/magasin/list', corps,  {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  addAListMagasin(corps: Magasin[]){
    return this.httpCli.post<Magasin[]>(this.host+'/stock/magasin/list2', corps,  {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  editAMagasin(code:String, corps:Magasin){
    return this.httpCli.put<Magasin>(this.host+'/stock/magasin/byCodMag/'+code, corps,  {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  deleteAMagasin(code:String){
   return this.httpCli.delete<boolean>(this.host+'/stock/magasin/byCodMag/'+code,  {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }




}
