import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LigneReception } from 'src/app/models/gestion/saisie/ligneReception.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LigneReceptionService {


  host: string = environment.backend2;

  constructor(private httpCli: HttpClient) { }

  //Partie réservée pour les lignes de récèption
  getAllLigneReception(){
    return this.httpCli.get<LigneReception[]>(this.host+'/stock/ligneReception/list');
  }

  getALigneReceptionById(code:String){
    return this.httpCli.get<LigneReception>(this.host+'/stock/ligneReception/byCodLigRec/'+code);
  }

  addALigneReception(corps:LigneReception){
    return this.httpCli.post<LigneReception>(this.host+'/stock/ligneReception/list', corps);
  }

  editALigneReception(code:String, corps:LigneReception){
    return this.httpCli.put<LigneReception>(this.host+'/stock/ligneReception/byCodLigRec/'+code, corps);
  }

  deleteALigneReception(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/ligneReception/byCodLigRec/'+code);
  }



}
