import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LigneDemandePrix } from 'src/app/models/gestion/saisie/ligneDemandePrix.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LigneDemandePrixService {

  host: string = environment.backend2;

  constructor(private httpCli: HttpClient) { }


  //Partie réservé pour ligne commande
  getAllLigneDemandePrix(){
    return this.httpCli.get<LigneDemandePrix[]>(this.host+'/stock/ligneDemandePrix/list');
  }

  getALigneDemandePrixById(code:String){
    return this.httpCli.get<LigneDemandePrix>(this.host+'/stock/ligneDemandePrix/byCodLigDemPri/'+code);
  }

  addALigneDemandePrix(corps:LigneDemandePrix){
    return this.httpCli.post<LigneDemandePrix>(this.host+'/stock/ligneDemandePrix/list', corps);
  }

  editALigneDemandePrix(code:String, corps:LigneDemandePrix){
    return this.httpCli.put<LigneDemandePrix>(this.host+'/stock/ligneDemandePrix/byCodLigDemPri/'+code, corps);
  }

  deleteALigneDemandePrix(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/ligneDemandePrix/byCodLigDemPri/'+code);
  }


}
