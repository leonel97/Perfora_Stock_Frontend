import { Exercice } from '../fichier/exercice';
import { Commande } from './commande.model';

export class LettreCommande {

  constructor(public numLettreComm: String, public valeur: number, public commande: Commande,
    public exercice: Exercice){

  }

}
