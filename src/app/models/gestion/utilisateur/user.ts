import {ExerciceFonction} from "./exercice-fonction";
import { Civilite } from "../parametrage/civilite";
import { Fonction } from "../parametrage/fonction";
import { Profession } from "../parametrage/profession";
import { CentreConsommation } from "../definition/centreConsommation";
import { Magasin } from "../definition/magasin.model";

export class User {
  idUtilisateur: number;
  login: string;
  motDePass: string;
  nomUtilisateur: string;
  prenomUtilisateur: string;
  activeUtilisateur: boolean;
  dateLastConnex: string;
  askMdp1erLance : boolean;
  accesChildService : boolean;
  civilite: Civilite;
  profession: Profession;
  fonction: Fonction;
  service: CentreConsommation;
  magasins: Magasin[];
}


