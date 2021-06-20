import { CentreConsommation } from '../definition/centreConsommation';
import { Exercice } from '../fichier/exercice';

export class DemandeApprovisionnement {

  constructor(public numDA: String, public dateDA: Date, public valeur: number,
    public valideDA: boolean, public exercice: Exercice,  public service: CentreConsommation,
    public description: String){

  }


}
