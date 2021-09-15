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
  private jwtTocken = null;

  constructor(private httpCli: HttpClient) { this.jwtTocken = localStorage.getItem('token'); }

    //Partie réservée pour Commande
    getAllCommande(){
      return this.httpCli.get<Commande[]>(this.host+'/stock/commande/list', {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    getACommandeById(code:String){
      return this.httpCli.get<Commande>(this.host+'/stock/commande/byCodCom/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    addACommande(corps:Commande){
      return this.httpCli.post<Commande>(this.host+'/stock/commande/list', corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    addACommande2(corps:EncapCommande){
      return this.httpCli.post<EncapCommande>(this.host+'/stock/commande/list2', corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    editACommande(code:String, corps:Commande){
      return this.httpCli.put<Commande>(this.host+'/stock/commande/byCodCom/'+code, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    editACommande2(code:String, corps:EncapCommande){
      return this.httpCli.put<EncapCommande>(this.host+'/stock/commande/byCodCom2/'+code, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    deleteACommande(code:String){
      return this.httpCli.delete<boolean>(this.host+'/stock/commande/byCodCom/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    deleteACommande2(code:String){
      return this.httpCli.delete<boolean>(this.host+'/stock/commande/byCodCom2/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }


}
