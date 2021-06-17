import { Exercice } from '../fichier/exercice';
import { Commande } from './commande.model';

export class CommandeAchat {

  constructor(public numComAchat: String, public valeur: number, public commande: Commande,
    public exercice: Exercice){

  }

}
