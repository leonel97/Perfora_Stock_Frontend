import { LigneReception } from '../ligneReception.model';
import { Reception } from '../reception.model';

export class EncapReception{

  constructor(public reception: Reception, public ligneReceptions: LigneReception[]){

  }


}
