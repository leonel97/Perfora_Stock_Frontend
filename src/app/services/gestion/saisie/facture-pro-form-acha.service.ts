import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Commande } from 'src/app/models/gestion/saisie/commande.model';
import { EncapCommande } from 'src/app/models/gestion/saisie/encapsuleur-model/encapCommande.model';
import { EncapFactureProformAchat } from 'src/app/models/gestion/saisie/encapsuleur-model/encapFactureProformAchat.model';
import { FactureProFormAcha } from 'src/app/models/gestion/saisie/factureProFormAcha.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FactureProFormAchaService {

  host: string = environment.backend2;
  private jwtTocken = null

  constructor(private httpCli: HttpClient) { this.jwtTocken = localStorage.getItem('token'); }

    //Partie réservée pour FactureProFormAcha
    getAllFactureProFormAcha(){
      return this.httpCli.get<FactureProFormAcha[]>(this.host+'/stock/factureProFormAcha/list', {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    getAFactureProFormAchaById(code:String){
      return this.httpCli.get<FactureProFormAcha>(this.host+'/stock/factureProFormAcha/byCodFacProForAch/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    getACommandeOfFpfaById(code:String, commande: Commande){
      return this.httpCli.post<EncapCommande>(this.host+'/stock/factureProFormAcha/byCodFacProForAch/'+code, commande, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    addAFactureProFormAcha(corps:FactureProFormAcha){
      return this.httpCli.post<FactureProFormAcha>(this.host+'/stock/factureProFormAcha/list', corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    addAFactureProFormAcha2(corps:EncapFactureProformAchat){
      return this.httpCli.post<EncapFactureProformAchat>(this.host+'/stock/factureProFormAcha/list2', corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    editAFactureProFormAcha(code:String, corps:FactureProFormAcha){
      return this.httpCli.put<FactureProFormAcha>(this.host+'/stock/factureProFormAcha/byCodFacProForAch/'+code, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    editAFactureProFormAcha2(code:String, corps:EncapFactureProformAchat){
      return this.httpCli.put<EncapFactureProformAchat>(this.host+'/stock/factureProFormAcha/byCodFacProForAch2/'+code, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    deleteAFactureProFormAcha(code:String){
      return this.httpCli.delete<boolean>(this.host+'/stock/factureProFormAcha/byCodFacProForAch/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    deleteAFactureProFormAcha2(code:String){
      return this.httpCli.delete<boolean>(this.host+'/stock/factureProFormAcha/byCodFacProForAch2/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }


}
