import { Commande } from '../commande.model';
import { LigneCommande } from '../ligneCommande.model';

export class EncapCommande {

  constructor(public commande: Commande, public ligneCommandes: LigneCommande[]){

  }


}
