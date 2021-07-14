import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Inventaire } from 'src/app/models/gestion/saisie/inventaire.model';
import { EncapInventaire } from 'src/app/models/gestion/saisie/encapsuleur-model/encapInventaire.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventaireService {

  host: string = environment.backend2;

  constructor(private httpCli: HttpClient) { }

    //Partie réservée pour Demande de prix
    getAllInventaire(){
      return this.httpCli.get<Inventaire[]>(this.host+'/stock/inventaire/list');
    }

    getInventaireById(code:String){
      return this.httpCli.get<Inventaire>(this.host+'/stock/inventaire/byCodSto/'+code);
    }

    addInventaire(corps:Inventaire){
      return this.httpCli.post<Inventaire>(this.host+'/stock/inventaire/list', corps);
    }

    addInventaire2(corps:EncapInventaire){
      return this.httpCli.post<EncapInventaire>(this.host+'/stock/inventaire/list2', corps);
    }

    editInventaire(code:String, corps:Inventaire){
      return this.httpCli.put<Inventaire>(this.host+'/stock/inventaire/byCodSto/'+code, corps);
    }

    editInventaire2(code:String, corps:EncapInventaire){
      return this.httpCli.put<EncapInventaire>(this.host+'/stock/inventaire/byCodSto2/'+code, corps);
    }

    deleteInventaire(code:String){
      return this.httpCli.delete<boolean>(this.host+'/stock/inventaire/byCodSto/'+code);
    }

    deleteInventaire2(code:String){
      return this.httpCli.delete<boolean>(this.host+'/stock/inventaire/byCodSto2/'+code);
    }


}
