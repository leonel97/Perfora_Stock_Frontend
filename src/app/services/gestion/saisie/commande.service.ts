import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Commande } from 'src/app/models/gestion/saisie/commande.model';
import { EncapCommande } from 'src/app/models/gestion/saisie/encapsuleur-model/encapCommande.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {

  host: string = environment.backend2;

  constructor(private httpCli: HttpClient) {}

    //Partie réservée pour Commande
    getAllCommande(){
      return this.httpCli.get<Commande[]>(this.host+'/stock/commande/list');
    }

    getCommandeByCodeExo(code:String){
      return this.httpCli.get<Commande[]>(this.host+'/stock/commande/byCodExo/'+code);
    }

    getACommandeById(code:String){
      return this.httpCli.get<Commande>(this.host+'/stock/commande/byCodCom/'+code);
    }

    getIfACommandeHasReceptById(code:String){
      return this.httpCli.get<boolean>(this.host+'/stock/commande/hasRecetp/'+code);
    }

    addACommande(corps:Commande){
      return this.httpCli.post<Commande>(this.host+'/stock/commande/list', corps);
    }

    addACommande2(corps:EncapCommande){
      return this.httpCli.post<EncapCommande>(this.host+'/stock/commande/list2', corps);
    }

    editACommande(code:String, corps:Commande){
      return this.httpCli.put<Commande>(this.host+'/stock/commande/byCodCom/'+code, corps);
    }

    editACommande2(code:String, corps:EncapCommande){
      return this.httpCli.put<EncapCommande>(this.host+'/stock/commande/byCodCom2/'+code, corps);
    }

    deleteACommande(code:String){
      return this.httpCli.delete<boolean>(this.host+'/stock/commande/byCodCom/'+code);
    }

    deleteACommande2(code:String){
      return this.httpCli.delete<boolean>(this.host+'/stock/commande/byCodCom2/'+code);
    }


}
