import { Exercice } from '../fichier/exercice';

export class CloturePeriodiq {

  public idCloturePer: number = null;

  constructor(public dateDebutCloturePer: Date, public dateFinCloturePer: Date, 
    public exercice: Exercice, public valide: boolean){

      

  }

}