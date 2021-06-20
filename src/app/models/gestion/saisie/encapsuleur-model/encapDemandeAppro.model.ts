import { DemandeApprovisionnement } from '../demandeApprovisionnement.model';
import { LigneDemandeAppro } from '../ligneDemandeAppro.model';

export class EncapDemandeAppro{

  constructor(public demandeApprovisionnement: DemandeApprovisionnement,
    public ligneDemandeAppros: LigneDemandeAppro[]){

    }


}
