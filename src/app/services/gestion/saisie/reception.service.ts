import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EncapReception } from 'src/app/models/gestion/saisie/encapsuleur-model/encapReception.model';
import { Reception } from 'src/app/models/gestion/saisie/reception.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReceptionService {


  host: string = environment.backend2;

  constructor(private httpCli: HttpClient) { }

    //Partie réservée pour les récèptions
    getAllReception(){
      return this.httpCli.get<Reception[]>(this.host+'/stock/reception/list');
    }

    getAReceptionById(code:String){
      return this.httpCli.get<Reception>(this.host+'/stock/reception/byCodRec/'+code);
    }

    addAReception(corps:Reception){
      return this.httpCli.post<Reception>(this.host+'/stock/reception/list', corps);
    }

    addAReception2(corps:EncapReception){
      return this.httpCli.post<EncapReception>(this.host+'/stock/reception/list2', corps);
    }

    editAReception(code:String, corps:Reception){
      return this.httpCli.put<Reception>(this.host+'/stock/reception/byCodRec/'+code, corps);
    }

    editAReception2(code:String, corps:EncapReception){
      return this.httpCli.put<EncapReception>(this.host+'/stock/reception/byCodRec2/'+code, corps);
    }

    editAReception3(code:String, corps:Reception){
      return this.httpCli.put<Reception>(this.host+'/stock/reception/byCodRec3/'+code, corps);
    }

    deleteAReception(code:String){
      return this.httpCli.delete<boolean>(this.host+'/stock/reception/byCodRec/'+code);
    }

    deleteAReception2(code:String){
      return this.httpCli.delete<boolean>(this.host+'/stock/reception/byCodRec2/'+code);
    }



}
