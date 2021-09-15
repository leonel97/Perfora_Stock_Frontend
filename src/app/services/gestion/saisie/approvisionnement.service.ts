import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Approvisionnement } from 'src/app/models/gestion/saisie/approvisionnement.model';
import { EncapApprovisionnement } from 'src/app/models/gestion/saisie/encapsuleur-model/encapApprovisionnement.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApprovisionnementService {



  host: string = environment.backend2;
  private jwtTocken = null;

  constructor(private httpCli: HttpClient) { this.jwtTocken = localStorage.getItem('token'); }

    //Partie réservée pour Bon Approvisionnement
    getAllAppro(){
      return this.httpCli.get<Approvisionnement[]>(this.host+'/stock/approvisionnement/list', {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    getAApproById(code:String){
      return this.httpCli.get<Approvisionnement>(this.host+'/stock/approvisionnement/byCodApp/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    addAAppro(corps:Approvisionnement){
      return this.httpCli.post<Approvisionnement>(this.host+'/stock/approvisionnement/list', corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    addAAppro2(corps:EncapApprovisionnement){
      return this.httpCli.post<EncapApprovisionnement>(this.host+'/stock/approvisionnement/list2', corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    editAAppro(code:String, corps:Approvisionnement){
      return this.httpCli.put<Approvisionnement>(this.host+'/stock/approvisionnement/byCodApp/'+code, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    editAAppro2(code:String, corps:EncapApprovisionnement){
      return this.httpCli.put<EncapApprovisionnement>(this.host+'/stock/approvisionnement/byCodApp2/'+code, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    editAAppro3(code:String, corps:Approvisionnement){
      return this.httpCli.put<Approvisionnement>(this.host+'/stock/approvisionnement/byCodApp3/'+code, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    deleteAAppro(code:String){
      return this.httpCli.delete<boolean>(this.host+'/stock/approvisionnement/byCodApp/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    deleteAAppro2(code:String){
      return this.httpCli.delete<boolean>(this.host+'/stock/approvisionnement/byCodApp2/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

}
