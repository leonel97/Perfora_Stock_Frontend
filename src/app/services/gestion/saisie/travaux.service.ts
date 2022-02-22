import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EncapTravaux } from 'src/app/models/gestion/saisie/encapsuleur-model/encapTravaux.model';
import { Travaux } from 'src/app/models/gestion/saisie/travaux.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TravauxService {

  host: string = environment.backend2;

  constructor(private httpCli: HttpClient) {}

  //Partie réservée pour Travaux
  getAllTravaux(){
    return this.httpCli.get<Travaux[]>(this.host+'/stock/travaux/list');
  }

  getTravauxByCodeExo(code:String){
    return this.httpCli.get<Travaux[]>(this.host+'/stock/travaux/byCodExo/'+code);
  }

  getATravauxById(code:String){
    return this.httpCli.get<Travaux>(this.host+'/stock/travaux/byCodTrav/'+code);
  }

  addATravaux(corps:Travaux){
    return this.httpCli.post<Travaux>(this.host+'/stock/travaux/list', corps);
  }

  addATravaux2(corps:EncapTravaux){
    return this.httpCli.post<EncapTravaux>(this.host+'/stock/travaux/list2', corps);
  }

  editATravaux(code:String, corps:Travaux){
    return this.httpCli.put<Travaux>(this.host+'/stock/travaux/byCodTrav/'+code, corps);
  }

  editATravaux2(code:String, corps:EncapTravaux){
    return this.httpCli.put<EncapTravaux>(this.host+'/stock/travaux/byCodTrav2/'+code, corps);
  }

  editATravaux3(code:String, corps:Travaux){
    return this.httpCli.put<Travaux>(this.host+'/stock/travaux/byCodTrav3/'+code, corps);
  }


  deleteATravaux(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/travaux/byCodTrav/'+code);
  }

  deleteATravaux2(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/travaux/byCodTrav2/'+code);
  }


}
