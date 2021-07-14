
import { Inventaire } from '../inventaire.model';
import { LigneInventaire } from '../ligneInventaire.model';

export class EncapInventaire {

  constructor(public inventaire: Inventaire, public ligneInventaires: LigneInventaire[]){

  }


}
