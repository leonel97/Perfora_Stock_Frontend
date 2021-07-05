import { ConsulterFrsForDp } from '../consulterFrsForDp.model';
import { DemandePrix } from '../demandPrix.model';
import { LigneDemandePrix } from '../ligneDemandePrix.model';

export class EncapDemandePrix {

  constructor(public demandePrix: DemandePrix, public ligneDemandePrixs: LigneDemandePrix[],
    public consulterFrsForDps: ConsulterFrsForDp[]){

  }


}
