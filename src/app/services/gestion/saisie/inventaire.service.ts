import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Inventaire } from 'src/app/models/gestion/saisie/inventaire.model';
import { EncapInventaire } from 'src/app/models/gestion/saisie/encapsuleur-model/encapInventaire.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventaireService {

  host: string = environment.backend2;
  private jwtTocken = null;

  constructor(private httpCli: HttpClient) { this.jwtTocken = localStorage.getItem('token'); }

    //Partie réservée pour Demande de prix
    getAllInventaire(){
      return this.httpCli.get<Inventaire[]>(this.host+'/stock/inventaire/list', {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    getInventaireById(code:String){
      return this.httpCli.get<Inventaire>(this.host+'/stock/inventaire/byCodSto/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    addInventaire(corps:Inventaire){
      return this.httpCli.post<Inventaire>(this.host+'/stock/inventaire/list', corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    addInventaire2(corps:EncapInventaire){
      return this.httpCli.post<EncapInventaire>(this.host+'/stock/inventaire/list2', corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    editInventaire(code:string, corps:Inventaire){
      return this.httpCli.put<Inventaire>(this.host+'/stock/inventaire/byCodSto/'+code, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    editInventaire2(code:string, corps:EncapInventaire){
      return this.httpCli.put<EncapInventaire>(this.host+'/stock/inventaire/byCodSto2/'+code, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    deleteInventaire(code:string){
      return this.httpCli.delete<boolean>(this.host+'/stock/inventaire/byCodSto/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    deleteInventaire2(code:string){
      return this.httpCli.delete<boolean>(this.host+'/stock/inventaire/byCodSto2/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    // ajustement des stocks à la validation de l'inventaire
    editInventaire3(code:string, corps:Inventaire){
      return this.httpCli.put<Inventaire>(this.host+'/stock/inventaire/byCodSto3/'+code, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }


}
