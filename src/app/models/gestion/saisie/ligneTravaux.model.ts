import { Uniter } from '../definition/uniter.model';
import { Travaux } from './travaux.model';

export class LigneTravaux {

    public idLigneTravaux: number;

    constructor(public qteLigneCommande: number, public puLigneCommande: number, public remise: number, 
        public tva: number, public taibic: number, public ts: number, public satisfaite: boolean, 
        public prixUnitTtc: boolean, public designationLigne: String, public travaux: Travaux, public uniter: Uniter){

    }

}