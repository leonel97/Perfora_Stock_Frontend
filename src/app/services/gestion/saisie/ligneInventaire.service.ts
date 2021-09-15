import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LigneInventaire } from 'src/app/models/gestion/saisie/ligneInventaire.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LigneInventaireService {

  host: string = environment.backend2;
  private jwtTocken = null;

  constructor(private httpCli: HttpClient) { this.jwtTocken = localStorage.getItem('token'); }


  //Partie réservé pour ligne inventaire
  getAllLigneInventaire(){
    return this.httpCli.get<LigneInventaire[]>(this.host+'/stock/ligneInventaire/list', {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  getLigneInventaireById(code:String){
    return this.httpCli.get<LigneInventaire>(this.host+'/stock/ligneInventaire/byCodSto/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  addLigneInventaire(corps:LigneInventaire){
    return this.httpCli.post<LigneInventaire>(this.host+'/stock/ligneInventaire/list', corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  editLigneInventaire(code:String, corps:LigneInventaire){
    return this.httpCli.put<LigneInventaire>(this.host+'/stock/ligneInventaire/byCodSto/'+code, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  deleteLigneInventaire(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/ligneInventaire/byCodSto/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }


}
