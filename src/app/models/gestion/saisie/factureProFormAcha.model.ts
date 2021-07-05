import { Fournisseur } from '../definition/fournisseur';
import { Exercice } from '../fichier/exercice';
import { Commande } from './commande.model';
import { DemandePrix } from './demandPrix.model';

export class FactureProFormAcha{

  constructor(public idFpfa: String, public dateFpfa: Date, public designationFpfa: String,
    public valideFpfa: boolean, public datePriseFpfa: Date, public dateDeplisFpfa: Date,
    public obserFpfa: String, public valeur: number, public fournisseur: Fournisseur,
    public exercice: Exercice, public commande: Commande, public demandePrix: DemandePrix){

  }


}
