import { Exercice } from '../fichier/exercice';
import { Magasin } from '../definition/magasin.model';

export class Inventaire {

  constructor(public numInv: String, public dateInv: Date, public descrInv: String,
    public valideInve: boolean, public valeur: number, public exercice: Exercice, public magasin: Magasin){

  }

}
