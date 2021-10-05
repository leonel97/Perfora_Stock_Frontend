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

  constructor(private httpCli: HttpClient) {}


  //Partie réservée pour Bon d'Appro (Demande d'Appro)
  getAllDemandeAppro(){
    return this.httpCli.get<DemandeApprovisionnement[]>(this.host+'/stock/demandeAppro/list');
  }

  getADemandeApproById(code:String){
    return this.httpCli.get<DemandeApprovisionnement>(this.host+'/stock/demandeAppro/byCodDemApp/'+code);
  }

  addADemandeAppro(corps:DemandeApprovisionnement){
    return this.httpCli.post<DemandeApprovisionnement>(this.host+'/stock/demandeAppro/list', corps);
  }

  addADemandeAppro2(corps:EncapDemandeAppro){
    return this.httpCli.post<EncapDemandeAppro>(this.host+'/stock/demandeAppro/list2', corps);
  }

  editADemandeAppro(code:String, corps:DemandeApprovisionnement){
    return this.httpCli.put<DemandeApprovisionnement>(this.host+'/stock/demandeAppro/byCodDemApp/'+code, corps);
  }

  editADemandeAppro2(code:String, corps:EncapDemandeAppro){
    return this.httpCli.put<EncapDemandeAppro>(this.host+'/stock/demandeAppro/byCodDemApp2/'+code, corps);
  }

  deleteADemandeAppro(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/demandeAppro/byCodDemApp/'+code);
  }

  deleteADemandeAppro2(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/demandeAppro/byCodDemApp2/'+code);
  }


}
