import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LigneReception } from 'src/app/models/gestion/saisie/ligneReception.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LigneReceptionService {


  host: string = environment.backend2;
  private jwtTocken = null;

  constructor(private httpCli: HttpClient) { this.jwtTocken = localStorage.getItem('token'); }

  //Partie réservée pour les lignes de récèption
  getAllLigneReception(){
    return this.httpCli.get<LigneReception[]>(this.host+'/stock/ligneReception/list', {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  getALigneReceptionById(code:String){
    return this.httpCli.get<LigneReception>(this.host+'/stock/ligneReception/byCodLigRec/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  addALigneReception(corps:LigneReception){
    return this.httpCli.post<LigneReception>(this.host+'/stock/ligneReception/list', corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  editALigneReception(code:String, corps:LigneReception){
    return this.httpCli.put<LigneReception>(this.host+'/stock/ligneReception/byCodLigRec/'+code, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  deleteALigneReception(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/ligneReception/byCodLigRec/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }



}
