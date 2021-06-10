import {PersonnePhysique} from "../gestion/personnes/personne-physique";
import {PersonneMorale} from "../gestion/personnes/personne-morale";

export class AutoComplete {
  display: string;
  nature: string;
  personnePhysique: PersonnePhysique;
  personneMorale: PersonneMorale;
}
