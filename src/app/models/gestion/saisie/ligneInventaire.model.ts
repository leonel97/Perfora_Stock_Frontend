import { Inventaire } from './inventaire.model';
import { Article } from '../definition/article.model';

export class LigneInventaire {

    public idLigneInv:  number = null;

  constructor(public pu: number, public stockTheoriq: number, public stockreel: number,
     public observation: String, public article: Article, public inventaire: Inventaire){

  }


}
