import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DemandePrix } from 'src/app/models/gestion/saisie/demandPrix.model';
import { EncapDemandePrix } from 'src/app/models/gestion/saisie/encapsuleur-model/encapDemandePrix.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DemandePrixService {

  host: string = environment.backend2;
  private jwtTocken = null;

  constructor(private httpCli: HttpClient) { this.jwtTocken = localStorage.getItem('token'); }

    //Partie réservée pour Demande de prix
    getAllDemandePrix(){
      return this.httpCli.get<DemandePrix[]>(this.host+'/stock/demandePrix/list', {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    getDemandePrixById(code:String){
      return this.httpCli.get<DemandePrix>(this.host+'/stock/demandePrix/byCodDemPri/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    addDemandePrix(corps:DemandePrix){
      return this.httpCli.post<DemandePrix>(this.host+'/stock/demandePrix/list', corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    addDemandePrix2(corps:EncapDemandePrix){
      return this.httpCli.post<EncapDemandePrix>(this.host+'/stock/demandePrix/list2', corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    editDemandePrix(code:String, corps:DemandePrix){
      return this.httpCli.put<DemandePrix>(this.host+'/stock/demandePrix/byCodDemPri/'+code, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    editDemandePrix2(code:String, corps:EncapDemandePrix){
      return this.httpCli.put<EncapDemandePrix>(this.host+'/stock/demandePrix/byCodDemPri2/'+code, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    deleteDemandePrix(code:String){
      return this.httpCli.delete<boolean>(this.host+'/stock/demandePrix/byCodDemPri/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    deleteDemandePrix2(code:String){
      return this.httpCli.delete<boolean>(this.host+'/stock/demandePrix/byCodDemPri2/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }


}
