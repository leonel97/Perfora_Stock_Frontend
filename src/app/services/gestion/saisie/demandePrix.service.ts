import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DemandePrix } from 'src/app/models/gestion/saisie/demandPrix.model';
import { EncapDemandePrix } from 'src/app/models/gestion/saisie/encapsuleur-model/encapDemandePrix.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DemandePrixService {

  host: string = environment.backend2;

  constructor(private httpCli: HttpClient) { }

    //Partie réservée pour Demande de prix
    getAllDemandePrix(){
      return this.httpCli.get<DemandePrix[]>(this.host+'/stock/demandePrix/list');
    }

    getDemandePrixById(code:String){
      return this.httpCli.get<DemandePrix>(this.host+'/stock/demandePrix/byCodDemPri/'+code);
    }

    addDemandePrix(corps:DemandePrix){
      return this.httpCli.post<DemandePrix>(this.host+'/stock/demandePrix/list', corps);
    }

    addDemandePrix2(corps:EncapDemandePrix){
      return this.httpCli.post<EncapDemandePrix>(this.host+'/stock/demandePrix/list2', corps);
    }

    editDemandePrix(code:String, corps:DemandePrix){
      return this.httpCli.put<DemandePrix>(this.host+'/stock/demandePrix/byCodDemPri/'+code, corps);
    }

    editDemandePrix2(code:String, corps:EncapDemandePrix){
      return this.httpCli.put<EncapDemandePrix>(this.host+'/stock/demandePrix/byCodDemPri2/'+code, corps);
    }

    deleteDemandePrix(code:String){
      return this.httpCli.delete<boolean>(this.host+'/stock/demandePrix/byCodDemPri/'+code);
    }

    deleteDemandePrix2(code:String){
      return this.httpCli.delete<boolean>(this.host+'/stock/demandePrix/byCodDemPri2/'+code);
    }


}
