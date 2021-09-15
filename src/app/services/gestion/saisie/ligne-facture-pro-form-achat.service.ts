import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LigneFactureProFormAchat } from 'src/app/models/gestion/saisie/ligneFactureProFormAchat.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LigneFactureProFormAchatService {



  host: string = environment.backend2;
  private jwtTocken = null;

  constructor(private httpCli: HttpClient) { this.jwtTocken = localStorage.getItem('token'); }


   //Partie réservée pour les LigneFactureProFormAchat
   getAllLigneFactureProFormAchat(){
    return this.httpCli.get<LigneFactureProFormAchat[]>(this.host+'/stock/ligneFactureProFormAchat/list', {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  getALigneFactureProFormAchatById(code:String){
    return this.httpCli.get<LigneFactureProFormAchat>(this.host+'/stock/ligneFactureProFormAchat/byCodLigDemApp/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  addALigneFactureProFormAchat(corps:LigneFactureProFormAchat){
    return this.httpCli.post<LigneFactureProFormAchat>(this.host+'/stock/ligneFactureProFormAchat/list', corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  editALigneFactureProFormAchat(code:String, corps:LigneFactureProFormAchat){
    return this.httpCli.put<LigneFactureProFormAchat>(this.host+'/stock/ligneFactureProFormAchat/byCodLigDemApp/'+code, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  deleteALigneFactureProFormAchat(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/ligneFactureProFormAchat/byCodLigDemApp/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }





}
