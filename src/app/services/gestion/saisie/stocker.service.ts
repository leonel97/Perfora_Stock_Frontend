import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Stocker } from 'src/app/models/gestion/saisie/stocker.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockerService {



  host: string = environment.backend2;

  constructor(private httpCli: HttpClient) {}

  //Partie réservée pour Stocker du stockage d'un article dans un magasin
  getAllStocker(){
    return this.httpCli.get<Stocker[]>(this.host+'/stock/stocker/list');
  }

  getAStockerById(code:String){
    return this.httpCli.get<Stocker>(this.host+'/stock/stocker/byCodSto/'+code);
  }

  addAStocker(corps:Stocker){
    return this.httpCli.post<Stocker>(this.host+'/stock/stocker/list', corps);
  }

  editAStocker(code:String, corps:Stocker){
    return this.httpCli.put<Stocker>(this.host+'/stock/stocker/byCodSto/'+code, corps);
  }

  deleteAStocker(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/stocker/byCodSto/'+code);
  }


}
