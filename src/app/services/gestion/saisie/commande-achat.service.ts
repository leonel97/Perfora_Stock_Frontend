import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommandeAchat } from 'src/app/models/gestion/saisie/commandeAchat.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommandeAchatService {

  host: string = environment.backend2;
  private jwtTocken = null;

  constructor(private httpCli: HttpClient) { this.jwtTocken = localStorage.getItem('token'); }

  //Partie réservée pour CommandeAchat
  getAllCommandeAchat(){
    return this.httpCli.get<CommandeAchat[]>(this.host+'/stock/commandeAchat/list', {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  getACommandeAchatById(code:String){
    return this.httpCli.get<CommandeAchat>(this.host+'/stock/commandeAchat/byCodComAch/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  addACommandeAchat(corps:CommandeAchat){
    return this.httpCli.post<CommandeAchat>(this.host+'/stock/commandeAchat/list', corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  editACommandeAchat(code:String, corps:CommandeAchat){
    return this.httpCli.put<CommandeAchat>(this.host+'/stock/commandeAchat/byCodComAch/'+code, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  deleteACommandeAchat(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/commandeAchat/byCodComAch/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }


}
