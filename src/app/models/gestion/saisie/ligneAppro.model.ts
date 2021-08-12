import { Approvisionnement } from './approvisionnement.model';
import { LigneDemandeAppro } from './ligneDemandeAppro.model';

export class LigneAppro {

  public idLigneAppro: number = null;

  constructor(public quantiteLigneAppro: number, public puligneAppro: number,
    public appro: Approvisionnement, public ligneDA: LigneDemandeAppro, public lastStockQte? :number){

  }

}
