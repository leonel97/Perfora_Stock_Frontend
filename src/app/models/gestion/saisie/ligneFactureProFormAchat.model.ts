import { Article } from '../definition/article.model';
import { Uniter } from '../definition/uniter.model';
import { FactureProFormAcha } from './factureProFormAcha.model';

export class LigneFactureProFormAchat{

  public idLigneFpfa: number = null;

  constructor(public qteLigneFpfa: number, public prixUnitLigneFpfa: number,
    public designLigneFpfa: String,
    public tauxTaxeAibicLigneFpfa: number, public tauxTvaLigneFpfa: number,
    public tauxTsLigneFpfa: number, public prixUnitHtLigneFpfa: number,
    public factureProFormAcha: FactureProFormAcha, public article: Article, public uniter: Uniter){

  }


}
