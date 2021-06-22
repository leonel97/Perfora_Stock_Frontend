import { Exercice } from '../fichier/exercice';

export class DemandePrix {

  

  constructor(public idDemandePrix: String, public designationDemandePrix: String, public dateDemandePrix: Date, public dateLimiteDemandePrix: Date,
    public valideDemandePrix: boolean, public valeur: number,
    public reporter: boolean, public exercice: Exercice){

  }


}
