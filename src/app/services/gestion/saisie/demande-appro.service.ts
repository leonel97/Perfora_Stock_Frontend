import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DemandeApprovisionnement } from 'src/app/models/gestion/saisie/demandeApprovisionnement.model';
import { EncapDemandeAppro } from 'src/app/models/gestion/saisie/encapsuleur-model/encapDemandeAppro.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DemandeApproService {

  host: string = environment.backend2;
  private jwtTocken = null;

  constructor(private httpCli: HttpClient) { this.jwtTocken = localStorage.getItem('token'); }


  //Partie réservée pour Bon d'Appro (Demande d'Appro)
  getAllDemandeAppro(){
    return this.httpCli.get<DemandeApprovisionnement[]>(this.host+'/stock/demandeAppro/list', {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  getADemandeApproById(code:String){
    return this.httpCli.get<DemandeApprovisionnement>(this.host+'/stock/demandeAppro/byCodDemApp/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  addADemandeAppro(corps:DemandeApprovisionnement){
    return this.httpCli.post<DemandeApprovisionnement>(this.host+'/stock/demandeAppro/list', corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  addADemandeAppro2(corps:EncapDemandeAppro){
    return this.httpCli.post<EncapDemandeAppro>(this.host+'/stock/demandeAppro/list2', corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  editADemandeAppro(code:String, corps:DemandeApprovisionnement){
    return this.httpCli.put<DemandeApprovisionnement>(this.host+'/stock/demandeAppro/byCodDemApp/'+code, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  editADemandeAppro2(code:String, corps:EncapDemandeAppro){
    return this.httpCli.put<EncapDemandeAppro>(this.host+'/stock/demandeAppro/byCodDemApp2/'+code, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  deleteADemandeAppro(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/demandeAppro/byCodDemApp/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  deleteADemandeAppro2(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/demandeAppro/byCodDemApp2/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }


}
