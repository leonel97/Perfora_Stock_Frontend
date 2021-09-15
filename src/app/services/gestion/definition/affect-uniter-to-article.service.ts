import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AffectUniterToArticle } from 'src/app/models/gestion/definition/affectUniterToArticle.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AffectUniterToArticleService {

  host: string = environment.backend2;
  private jwtTocken = null;

  constructor(private httpCli: HttpClient) { this.jwtTocken = localStorage.getItem('token'); }

  //Partie réservé pour les Unités
  getAllAffectUniterToArticle(){
    return this.httpCli.get<AffectUniterToArticle[]>(this.host+'/stock/affectUniterToArticle/list', {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});

  }

  getAffectUniterToArticleById(code:String){
    return this.httpCli.get<AffectUniterToArticle>(this.host+'/stock/affectUniterToArticle/byIdAffUniToArti/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  editAAffectUniterToArticle(code:String, corps:AffectUniterToArticle){
    return this.httpCli.put<AffectUniterToArticle>(this.host+'/stock/affectUniterToArticle/byIdAffUniToArti/'+code, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  addAAffectUniterToArticle(corps:AffectUniterToArticle){
    return this.httpCli.post<AffectUniterToArticle>(this.host+'/stock/affectUniterToArticle/list', corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  deleteAAffectUniterToArticle(code:String){
    return this.httpCli.delete<Boolean>(this.host+'/stock/affectUniterToArticle/byIdAffUniToArti/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }



}
