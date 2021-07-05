import { Fournisseur } from '../definition/fournisseur';
import { DemandePrix } from './demandPrix.model';

export class ConsulterFrsForDp{

  public idConsulterFrsForDp: number;

  constructor(public dateRemise: Date, public choisit: boolean, public fournisseur: Fournisseur,
    public demandePrix: DemandePrix){

  }


}
