import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LigneDemandeAppro } from 'src/app/models/gestion/saisie/ligneDemandeAppro.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LigneDemandeApproService {



  host: string = environment.backend2;

  constructor(private httpCli: HttpClient) {}


   //Partie réservée pour les lignes de demande d'Approvisionnement
   getAllLigneDemandeAppro(){
    return this.httpCli.get<LigneDemandeAppro[]>(this.host+'/stock/ligneDemandeAppro/list');
  }

  getALigneDemandeApproById(code:String){
    return this.httpCli.get<LigneDemandeAppro>(this.host+'/stock/ligneDemandeAppro/byCodLigDemApp/'+code);
  }

  addALigneDemandeAppro(corps:LigneDemandeAppro){
    return this.httpCli.post<LigneDemandeAppro>(this.host+'/stock/ligneDemandeAppro/list', corps);
  }

  editALigneDemandeAppro(code:String, corps:LigneDemandeAppro){
    return this.httpCli.put<LigneDemandeAppro>(this.host+'/stock/ligneDemandeAppro/byCodLigDemApp/'+code, corps);
  }

  deleteALigneDemandeAppro(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/ligneDemandeAppro/byCodLigDemApp/'+code);
  }





}
