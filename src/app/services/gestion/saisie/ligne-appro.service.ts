import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LigneAppro } from 'src/app/models/gestion/saisie/ligneAppro.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LigneApproService {



  host: string = environment.backend2;
  private jwtTocken = null;

  constructor(private httpCli: HttpClient) { this.jwtTocken = localStorage.getItem('token'); }

    //Partie réservée pour Ligne Bon Approvisionnement
    getAllLigneAppro(){
      return this.httpCli.get<LigneAppro[]>(this.host+'/stock/ligneAppro/list', {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    getALigneApproById(code:String){
      return this.httpCli.get<LigneAppro>(this.host+'/stock/ligneAppro/byCodLigApp/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    addALigneAppro(corps:LigneAppro){
      return this.httpCli.post<LigneAppro>(this.host+'/stock/ligneAppro/list', corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    editALigneAppro(code:String, corps:LigneAppro){
      return this.httpCli.put<LigneAppro>(this.host+'/stock/ligneAppro/byCodLigApp/'+code, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    deleteALigneAppro(code:String){
      return this.httpCli.delete<boolean>(this.host+'/stock/ligneAppro/byCodLigApp/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }




}
