import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LigneInventaire } from 'src/app/models/gestion/saisie/ligneInventaire.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LigneInventaireService {

  host: string = environment.backend2;

  constructor(private httpCli: HttpClient) { }


  //Partie réservé pour ligne inventaire
  getAllLigneInventaire(){
    return this.httpCli.get<LigneInventaire[]>(this.host+'/stock/ligneInventaire/list');
  }

  getLigneInventaireById(code:String){
    return this.httpCli.get<LigneInventaire>(this.host+'/stock/ligneInventaire/byCodSto/'+code);
  }

  addLigneInventaire(corps:LigneInventaire){
    return this.httpCli.post<LigneInventaire>(this.host+'/stock/ligneInventaire/list', corps);
  }

  editLigneInventaire(code:String, corps:LigneInventaire){
    return this.httpCli.put<LigneInventaire>(this.host+'/stock/ligneInventaire/byCodSto/'+code, corps);
  }

  deleteLigneInventaire(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/ligneInventaire/byCodSto/'+code);
  }


}
