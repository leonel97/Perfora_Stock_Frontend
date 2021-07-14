import { Article } from '../definition/article.model';
import { Uniter } from '../definition/uniter.model';
import { DemandeApprovisionnement } from './demandeApprovisionnement.model';

export class LigneDemandeAppro {

  public idLigneDA: number = null;

  constructor(public quantiteDemandee: number, public article: Article, public uniter: Uniter,
    public appro: DemandeApprovisionnement, public satisfaite?: boolean){

  }


}
