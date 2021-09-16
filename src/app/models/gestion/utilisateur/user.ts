import {ExerciceFonction} from "./exercice-fonction";
import { Civilite } from "../parametrage/civilite";
import { Fonction } from "../parametrage/fonction";
import { Profession } from "../parametrage/profession";
import { CentreConsommation } from "../definition/centreConsommation";
import { Magasin } from "../definition/magasin.model";

export class User {

  
  public idUtilisateur: number = null;
  
  constructor(public login: string,
    public motDePass: string,
    public nomUtilisateur: string,
    public prenomUtilisateur: string,
    public activeUtilisateur: boolean,
    public dateLastConnex: string,
    public askMdp1erLance : boolean,
    public accesChildService : boolean,
    public civilite: Civilite,
    public profession: Profession,
    public  fonction: Fonction,
    public service: CentreConsommation,
    public  magasins: Magasin[]){

    }
  /*login: string;
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
  magasins: Magasin[];*/
}


