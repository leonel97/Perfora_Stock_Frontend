import { Exercice } from '../fichier/exercice';
import { Commande } from './commande.model';

export class AppelOffre {

  constructor(public numAppelOffre: String, public valeur: number, public commande: Commande,
    public exercice: Exercice){

  }

}
