import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LigneAppro } from 'src/app/models/gestion/saisie/ligneAppro.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LigneApproService {



  host: string = environment.backend2;

  constructor(private httpCli: HttpClient) { }

    //Partie réservée pour Ligne Bon Approvisionnement
    getAllLigneAppro(){
      return this.httpCli.get<LigneAppro[]>(this.host+'/stock/ligneAppro/list');
    }

    getALigneApproById(code:String){
      return this.httpCli.get<LigneAppro>(this.host+'/stock/ligneAppro/byCodLigApp/'+code);
    }

    addALigneAppro(corps:LigneAppro){
      return this.httpCli.post<LigneAppro>(this.host+'/stock/ligneAppro/list', corps);
    }

    editALigneAppro(code:String, corps:LigneAppro){
      return this.httpCli.put<LigneAppro>(this.host+'/stock/ligneAppro/byCodLigApp/'+code, corps);
    }

    deleteALigneAppro(code:String){
      return this.httpCli.delete<boolean>(this.host+'/stock/ligneAppro/byCodLigApp/'+code);
    }




}
