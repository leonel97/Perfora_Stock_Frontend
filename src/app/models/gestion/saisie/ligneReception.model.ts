import { LigneCommande } from './ligneCommande.model';
import { Reception } from './reception.model';

export class LigneReception {

  public idLigneReception: number = null;

  constructor(public quantiteLigneReception: number, public puLigneReception: number,
    public observationLigneReception: String, public lastCump: number, public ligneCommande: LigneCommande,
    public reception: Reception){

  }

}
