import { Magasin } from '../definition/magasin.model';
import { Exercice } from '../fichier/exercice';

export class Approvisionnement{

  constructor(public numAppro: String, public descriptionAppro: String, public dateAppro: Date,
    public valideAppro: boolean, public valeur: number, public exercice: Exercice,
    public magasin: Magasin) {

  }

}
