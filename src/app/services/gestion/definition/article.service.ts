import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Article } from 'src/app/models/gestion/definition/article.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  host: string = environment.backend2;

  constructor(private httpCli: HttpClient) { }

  //partie Réservée pour les articles
  getAllArticle(){
    return this.httpCli.get<Article[]>(this.host+'/stock/article/list');
  }

  getArticleById(code:String){
    return this.httpCli.get<Article>(this.host+'/stock/article/byCodArt/'+code);
  }

  addArticle(corps: Article){
    return this.httpCli.post<Article>(this.host+'/stock/article/list', corps);
  }

  addAListArticle(corps: Article[]){
    return this.httpCli.post<Article[]>(this.host+'/stock/article/list2', corps);
  }

  addAListArticleForStockInit(corps: Article[]){
    return this.httpCli.post<Article[]>(this.host+'/stock/article/list3', corps);
  }

  editArticle(code:String, corps:Article){
    return this.httpCli.put<Article>(this.host+'/stock/article/byCodArt/'+code, corps);
  }

  deleteArticle(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/article/byCodArt/'+code);
  }


}
