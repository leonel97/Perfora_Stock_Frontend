import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommandeAchat } from 'src/app/models/gestion/saisie/commandeAchat.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommandeAchatService {

  host: string = environment.backend2;

  constructor(private httpCli: HttpClient) {}

  //Partie réservée pour CommandeAchat
  getAllCommandeAchat(){
    return this.httpCli.get<CommandeAchat[]>(this.host+'/stock/commandeAchat/list');
  }

  getCommandeAchatByCodeExo(code:String){
    return this.httpCli.get<CommandeAchat[]>(this.host+'/stock/commandeAchat/byCodExo/'+code);
  }

  getACommandeAchatById(code:String){
    return this.httpCli.get<CommandeAchat>(this.host+'/stock/commandeAchat/byCodComAch/'+code);
  }

  addACommandeAchat(corps:CommandeAchat){
    return this.httpCli.post<CommandeAchat>(this.host+'/stock/commandeAchat/list', corps);
  }

  editACommandeAchat(code:String, corps:CommandeAchat){
    return this.httpCli.put<CommandeAchat>(this.host+'/stock/commandeAchat/byCodComAch/'+code, corps);
  }

  deleteACommandeAchat(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/commandeAchat/byCodComAch/'+code);
  }


}
