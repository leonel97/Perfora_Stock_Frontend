import {ExerciceFonction} from "./exercice-fonction";
import { Civilite } from "../parametrage/civilite";
import { Fonction } from "../parametrage/fonction";
import { Profession } from "../parametrage/profession";
import { CentreConsommation } from "../definition/centreConsommation";
import { UserGroup } from "./user-group";

export class User {
  idUtilisateur: number;
  login: string;
  motDePass: string;
  nomUtilisateur: string;
  prenomUtilisateur: string;
  password_confirmation: string;
  //imageUrl: string;
  //langKey: string;
  activeUtilisateur: boolean;
  askMdp1erLance : boolean;
  civilite: Civilite;
  profession: Profession;
  fonction: Fonction;
  service: CentreConsommation;
  groupUser: UserGroup;
  authorities: string[];
  token?: string;
// A revoir 
  exercicefonctions: ExerciceFonction[];
  defaultExerciceFonction:ExerciceFonction;
  currentExerciceFonction:ExerciceFonction;
}


