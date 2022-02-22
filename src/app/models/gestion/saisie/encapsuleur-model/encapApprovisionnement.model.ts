import { Approvisionnement } from '../approvisionnement.model';
import { DemandeApprovisionnement } from '../demandeApprovisionnement.model';
import { LigneAppro } from '../ligneAppro.model';

export class EncapApprovisionnement{

  constructor(public approvisionnement: Approvisionnement,
    public ligneAppros: LigneAppro[], public demandeApprovisionnement: DemandeApprovisionnement){

  }

}
