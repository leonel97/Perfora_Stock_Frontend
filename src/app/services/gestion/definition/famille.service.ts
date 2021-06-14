import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Famille } from 'src/app/models/gestion/definition/famille.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FamilleService {

  host: string = environment.backend2;

  constructor(private httpCli: HttpClient) { }

   //Partie réservée pour les familles
   getAllFamille(){
    return this.httpCli.get<Famille[]>(this.host+'/stock/famille/list');
  }

  getFamilleById(code:String){
    return this.httpCli.get<Famille>(this.host+'/stock/famille/byCodFam/'+code);
  }

  addAFamille(corps:Famille){
    return this.httpCli.post<Famille>(this.host+'/stock/famille/list', corps);
  }

  editAFamille(code:String, corps: Famille){
    return this.httpCli.put<Famille>(this.host+'/stock/famille/byCodFam/'+code,corps)
  }

  deleteAFamille(code:String){
    return this.httpCli.delete<Boolean>(this.host+'/stock/famille/byCodFam/'+code);
  }


}
