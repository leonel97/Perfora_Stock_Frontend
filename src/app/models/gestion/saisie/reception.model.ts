import { Magasin } from '../definition/magasin.model'
import { Exercice } from "../fichier/exercice"

export class Reception{

  public dateValidation: Date = null;

    constructor(public numReception: String, public observation: String, public dateReception: Date,
      public valideRecep: boolean, public valeur: number, public referenceReception: String,
      public refBordLivraiRecept: String, public exercice: Exercice, public magasin: Magasin){

    }


}
