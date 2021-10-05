import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LigneCommande } from 'src/app/models/gestion/saisie/ligneCommande.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LigneCommandeService {

  host: string = environment.backend2;

  constructor(private httpCli: HttpClient) { }


  //Partie réservé pour ligne commande
  getAllLigneCommande(){
    return this.httpCli.get<LigneCommande[]>(this.host+'/stock/ligneCommande/list');
  }

  getALigneCommandeById(code:String){
    return this.httpCli.get<LigneCommande>(this.host+'/stock/ligneCommande/byCodLigCom/'+code);
  }

  addALigneCommande(corps:LigneCommande){
    return this.httpCli.post<LigneCommande>(this.host+'/stock/ligneCommande/list', corps);
  }

  editALigneCommande(code:String, corps:LigneCommande){
    return this.httpCli.put<LigneCommande>(this.host+'/stock/ligneCommande/byCodLigCom/'+code, corps);
  }

  deleteALigneCommande(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/ligneCommande/byCodLigCom/'+code);
  }


}
