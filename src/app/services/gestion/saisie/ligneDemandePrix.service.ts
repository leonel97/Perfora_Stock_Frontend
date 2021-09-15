import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LigneDemandePrix } from 'src/app/models/gestion/saisie/ligneDemandePrix.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LigneDemandePrixService {

  host: string = environment.backend2;
  private jwtTocken = null;

  constructor(private httpCli: HttpClient) { this.jwtTocken = localStorage.getItem('token'); }


  //Partie réservé pour ligne commande
  getAllLigneDemandePrix(){
    return this.httpCli.get<LigneDemandePrix[]>(this.host+'/stock/ligneDemandePrix/list', {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  getALigneDemandePrixById(code:String){
    return this.httpCli.get<LigneDemandePrix>(this.host+'/stock/ligneDemandePrix/byCodLigDemPri/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  addALigneDemandePrix(corps:LigneDemandePrix){
    return this.httpCli.post<LigneDemandePrix>(this.host+'/stock/ligneDemandePrix/list', corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  editALigneDemandePrix(code:String, corps:LigneDemandePrix){
    return this.httpCli.put<LigneDemandePrix>(this.host+'/stock/ligneDemandePrix/byCodLigDemPri/'+code, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  deleteALigneDemandePrix(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/ligneDemandePrix/byCodLigDemPri/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }


}
