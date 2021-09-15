import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Famille } from 'src/app/models/gestion/definition/famille.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FamilleService {

  host: string = environment.backend2;
  private jwtTocken = null;

  constructor(private httpCli: HttpClient) { this.jwtTocken = localStorage.getItem('token'); }

   //Partie réservée pour les familles
   getAllFamille(){
    return this.httpCli.get<Famille[]>(this.host+'/stock/famille/list', {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  getFamilleById(code:String){
    return this.httpCli.get<Famille>(this.host+'/stock/famille/byCodFam/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  addAFamille(corps:Famille){
    return this.httpCli.post<Famille>(this.host+'/stock/famille/list', corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  addAListFamille(corps:Famille[]){
    return this.httpCli.post<Famille[]>(this.host+'/stock/famille/list2', corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  editAFamille(code:String, corps: Famille){
    return this.httpCli.put<Famille>(this.host+'/stock/famille/byCodFam/'+code,corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})})
  }

  deleteAFamille(code:String){
    return this.httpCli.delete<Boolean>(this.host+'/stock/famille/byCodFam/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }


}
