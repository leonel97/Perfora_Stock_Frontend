import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LigneReception } from 'src/app/models/gestion/saisie/ligneReception.model';
import { LigneTravaux } from 'src/app/models/gestion/saisie/ligneTravaux.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LigneTravauxService {


  host: string = environment.backend2;

  constructor(private httpCli: HttpClient) {}

  //Partie réservée pour les lignes de travaux
  getAllLigneTravaux(){
    return this.httpCli.get<LigneTravaux[]>(this.host+'/stock/ligneTravaux/list');
  }

  getALigneTravauxById(code:String){
    return this.httpCli.get<LigneTravaux>(this.host+'/stock/ligneTravaux/byCodLigTrav/'+code);
  }

  getLignesTravauxByCodeTravaux(code:String){
    return this.httpCli.get<LigneTravaux[]>(this.host+'/stock/ligneTravaux/list/byCodeTrav/'+code);
  }

  addALigneTravaux(corps:LigneTravaux){
    return this.httpCli.post<LigneTravaux>(this.host+'/stock/ligneTravaux/list', corps);
  }

  editALigneTravaux(code:String, corps:LigneTravaux){
    return this.httpCli.put<LigneTravaux>(this.host+'/stock/ligneTravaux/byCodLigTrav/'+code, corps);
  }

  deleteALigneTravaux(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/ligneTravaux/byCodLigTrav/'+code);
  }



}
