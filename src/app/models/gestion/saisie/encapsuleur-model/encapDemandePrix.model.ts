import { DemandePrix } from '../demandPrix.model';
import { LigneDemandePrix } from '../ligneDemandePrix.model';

export class EncapDemandePrix {

  constructor(public demandePrix: DemandePrix, public ligneDemandePrixs: LigneDemandePrix[]){

  }


}
