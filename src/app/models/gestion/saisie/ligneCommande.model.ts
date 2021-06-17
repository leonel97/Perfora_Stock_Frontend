import { Article } from '../definition/article.model';
import { Uniter } from '../definition/uniter.model';
import { Commande } from './commande.model';

export class LigneCommande {

  public idLigneCommande: number = null;

  constructor(public qteLigneCommande: number, public puLigneCommande: number, public remise: number,
    public tva: number, public taibic: number, public ts: number, public numCommande: Commande,
    public article: Article, public uniter: Uniter){

  }


}
