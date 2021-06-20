import { Article } from '../definition/article.model';
import { Magasin } from '../definition/magasin.model';

export class Stocker {

  public idStocker: number = null;

  constructor(public quantiterStocker: number, public stockDeSecuriter: number,
    public stockMinimal: number, public cmup: number, public article: Article,
    public magasin: Magasin){

  }

}
