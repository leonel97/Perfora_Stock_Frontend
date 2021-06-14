import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TypeArticle } from 'src/app/models/gestion/definition/typeArticle.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TypeArticleService {

  host: string = environment.backend2;

  constructor(private httpCli: HttpClient) { }

  //Partie réservée TypeArticle
  getAllTypeArticle(){
    return this.httpCli.get<TypeArticle[]>(this.host+'/stock/typeArticle/list');
  }

  getATypeArticleById(code:String){
    return this.httpCli.get<TypeArticle>(this.host+'/stock/typeArticle/byCodTypArti/'+code);
  }

  addATypeArticle(corps:TypeArticle){
   return this.httpCli.post<TypeArticle>(this.host+'/stock/typeArticle/list', corps);
  }

  editATypeArticle(code:String, corps:TypeArticle){
    return this.httpCli.put<TypeArticle>(this.host+'/stock/typeArticle/byCodTypArti/'+code, corps);
  }

  deleteATypeArticle(code:String){
   return this.httpCli.delete<boolean>(this.host+'/stock/typeArticle/byCodTypArti/'+code);
  }





}
