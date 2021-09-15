import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Article } from 'src/app/models/gestion/definition/article.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  host: string = environment.backend2;
  private jwtTocken = null;

  constructor(private httpCli: HttpClient) {  this.jwtTocken = localStorage.getItem('token'); }

  //partie Réservée pour les articles
  getAllArticle(){
    return this.httpCli.get<Article[]>(this.host+'/stock/article/list', {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  getArticleById(code:String){
    return this.httpCli.get<Article>(this.host+'/stock/article/byCodArt/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  addArticle(corps: Article){
    return this.httpCli.post<Article>(this.host+'/stock/article/list', corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  addAListArticle(corps: Article[]){
    return this.httpCli.post<Article[]>(this.host+'/stock/article/list2', corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  addAListArticleForStockInit(corps: Article[]){
    return this.httpCli.post<Article[]>(this.host+'/stock/article/list3', corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  editArticle(code:String, corps:Article){
    return this.httpCli.put<Article>(this.host+'/stock/article/byCodArt/'+code, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  deleteArticle(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/article/byCodArt/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }


}
