import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LigneFactureProFormAchat } from 'src/app/models/gestion/saisie/ligneFactureProFormAchat.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LigneFactureProFormAchatService {



  host: string = environment.backend2;

  constructor(private httpCli: HttpClient) { }


   //Partie réservée pour les LigneFactureProFormAchat
   getAllLigneFactureProFormAchat(){
    return this.httpCli.get<LigneFactureProFormAchat[]>(this.host+'/stock/ligneFactureProFormAchat/list');
  }

  getALigneFactureProFormAchatById(code:String){
    return this.httpCli.get<LigneFactureProFormAchat>(this.host+'/stock/ligneFactureProFormAchat/byCodLigDemApp/'+code);
  }

  addALigneFactureProFormAchat(corps:LigneFactureProFormAchat){
    return this.httpCli.post<LigneFactureProFormAchat>(this.host+'/stock/ligneFactureProFormAchat/list', corps);
  }

  editALigneFactureProFormAchat(code:String, corps:LigneFactureProFormAchat){
    return this.httpCli.put<LigneFactureProFormAchat>(this.host+'/stock/ligneFactureProFormAchat/byCodLigDemApp/'+code, corps);
  }

  deleteALigneFactureProFormAchat(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/ligneFactureProFormAchat/byCodLigDemApp/'+code);
  }





}
