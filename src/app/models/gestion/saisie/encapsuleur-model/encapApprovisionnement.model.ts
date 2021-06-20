import { Approvisionnement } from '../approvisionnement.model';
import { LigneAppro } from '../ligneAppro.model';

export class EncapApprovisionnement{

  constructor(public approvisionnement: Approvisionnement,
    public ligneAppros: LigneAppro[]){

  }

}
