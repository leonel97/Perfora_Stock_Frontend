import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TypeArticle } from 'src/app/models/gestion/definition/typeArticle.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TypeArticleService {

  host: string = environment.backend2;
  private jwtTocken = null;

  constructor(private httpCli: HttpClient) { this.jwtTocken = localStorage.getItem('token'); }

  //Partie réservée TypeArticle
  getAllTypeArticle(){
    return this.httpCli.get<TypeArticle[]>(this.host+'/stock/typeArticle/list', {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  getATypeArticleById(code:String){
    return this.httpCli.get<TypeArticle>(this.host+'/stock/typeArticle/byCodTypArti/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  addATypeArticle(corps:TypeArticle){
   return this.httpCli.post<TypeArticle>(this.host+'/stock/typeArticle/list', corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  addAListTypeArticle(corps: TypeArticle[]){
    return this.httpCli.post<TypeArticle[]>(this.host+'/stock/typeArticle/list2', corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  editATypeArticle(code:String, corps:TypeArticle){
    return this.httpCli.put<TypeArticle>(this.host+'/stock/typeArticle/byCodTypArti/'+code, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  deleteATypeArticle(code:String){
   return this.httpCli.delete<boolean>(this.host+'/stock/typeArticle/byCodTypArti/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }





}
