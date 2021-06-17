import { Exercice } from '../fichier/exercice';
import { Commande } from './commande.model';

export class BondTravail {

  constructor(public numBondTravail: String, public valeur: number, public commande: Commande,
    public exercice: Exercice){

  }

}
