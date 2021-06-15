import { Article } from './article.model';
import { Uniter } from './uniter.model';

export class AffectUniterToArticle {

  public idAffectUniterToArticle: number = null;

  constructor(public article: Article, public uniter: Uniter){

  }

}
