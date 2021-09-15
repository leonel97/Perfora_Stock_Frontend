import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Stocker } from 'src/app/models/gestion/saisie/stocker.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockerService {



  host: string = environment.backend2;
  private jwtTocken = null;

  constructor(private httpCli: HttpClient) { this.jwtTocken = localStorage.getItem('token'); }

  //Partie réservée pour Stocker du stockage d'un article dans un magasin
  getAllStocker(){
    return this.httpCli.get<Stocker[]>(this.host+'/stock/stocker/list', {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  getAStockerById(code:String){
    return this.httpCli.get<Stocker>(this.host+'/stock/stocker/byCodSto/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  addAStocker(corps:Stocker){
    return this.httpCli.post<Stocker>(this.host+'/stock/stocker/list', corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  editAStocker(code:String, corps:Stocker){
    return this.httpCli.put<Stocker>(this.host+'/stock/stocker/byCodSto/'+code, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  deleteAStocker(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/stocker/byCodSto/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }


}
