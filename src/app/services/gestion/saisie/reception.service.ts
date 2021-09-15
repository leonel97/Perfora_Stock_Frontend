import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EncapReception } from 'src/app/models/gestion/saisie/encapsuleur-model/encapReception.model';
import { Reception } from 'src/app/models/gestion/saisie/reception.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReceptionService {


  host: string = environment.backend2;
  private jwtTocken = null;

  constructor(private httpCli: HttpClient) { this.jwtTocken = localStorage.getItem('token'); }

    //Partie réservée pour les récèptions
    getAllReception(){
      return this.httpCli.get<Reception[]>(this.host+'/stock/reception/list', {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    getAReceptionById(code:String){
      return this.httpCli.get<Reception>(this.host+'/stock/reception/byCodRec/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    addAReception(corps:Reception){
      return this.httpCli.post<Reception>(this.host+'/stock/reception/list', corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    addAReception2(corps:EncapReception){
      return this.httpCli.post<EncapReception>(this.host+'/stock/reception/list2', corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    editAReception(code:String, corps:Reception){
      return this.httpCli.put<Reception>(this.host+'/stock/reception/byCodRec/'+code, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    editAReception2(code:String, corps:EncapReception){
      return this.httpCli.put<EncapReception>(this.host+'/stock/reception/byCodRec2/'+code, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    editAReception3(code:String, corps:Reception){
      return this.httpCli.put<Reception>(this.host+'/stock/reception/byCodRec3/'+code, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    deleteAReception(code:String){
      return this.httpCli.delete<boolean>(this.host+'/stock/reception/byCodRec/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    deleteAReception2(code:String){
      return this.httpCli.delete<boolean>(this.host+'/stock/reception/byCodRec2/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }



}
