import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AffectUniterToArticle } from 'src/app/models/gestion/definition/affectUniterToArticle.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AffectUniterToArticleService {

  host: string = environment.backend2;

  constructor(private httpCli: HttpClient) { }

  //Partie réservé pour les Unités
  getAllAffectUniterToArticle(){
    return this.httpCli.get<AffectUniterToArticle[]>(this.host+'/stock/affectUniterToArticle/list');

  }

  getAffectUniterToArticleById(code:String){
    return this.httpCli.get<AffectUniterToArticle>(this.host+'/stock/affectUniterToArticle/byIdAffUniToArti/'+code);
  }

  editAAffectUniterToArticle(code:String, corps:AffectUniterToArticle){
    return this.httpCli.put<AffectUniterToArticle>(this.host+'/stock/affectUniterToArticle/byIdAffUniToArti/'+code, corps);
  }

  addAAffectUniterToArticle(corps:AffectUniterToArticle){
    return this.httpCli.post<AffectUniterToArticle>(this.host+'/stock/affectUniterToArticle/list', corps);
  }

  deleteAAffectUniterToArticle(code:String){
    return this.httpCli.delete<Boolean>(this.host+'/stock/affectUniterToArticle/byIdAffUniToArti/'+code);
  }



}
