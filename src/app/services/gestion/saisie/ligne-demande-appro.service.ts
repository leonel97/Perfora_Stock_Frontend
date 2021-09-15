import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LigneDemandeAppro } from 'src/app/models/gestion/saisie/ligneDemandeAppro.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LigneDemandeApproService {



  host: string = environment.backend2;
  private jwtTocken = null;

  constructor(private httpCli: HttpClient) { this.jwtTocken = localStorage.getItem('token'); }


   //Partie réservée pour les lignes de demande d'Approvisionnement
   getAllLigneDemandeAppro(){
    return this.httpCli.get<LigneDemandeAppro[]>(this.host+'/stock/ligneDemandeAppro/list', {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  getALigneDemandeApproById(code:String){
    return this.httpCli.get<LigneDemandeAppro>(this.host+'/stock/ligneDemandeAppro/byCodLigDemApp/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  addALigneDemandeAppro(corps:LigneDemandeAppro){
    return this.httpCli.post<LigneDemandeAppro>(this.host+'/stock/ligneDemandeAppro/list', corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  editALigneDemandeAppro(code:String, corps:LigneDemandeAppro){
    return this.httpCli.put<LigneDemandeAppro>(this.host+'/stock/ligneDemandeAppro/byCodLigDemApp/'+code, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  deleteALigneDemandeAppro(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/ligneDemandeAppro/byCodLigDemApp/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }





}
