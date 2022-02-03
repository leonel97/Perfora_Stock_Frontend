import { LigneTravaux } from '../ligneTravaux.model';
import { Travaux } from '../travaux.model';

export class EncapTravaux {

    constructor(public travaux: Travaux, public lignesTravaux: LigneTravaux[]){

    }

}