import { Fournisseur } from '../definition/fournisseur';
import { Exercice } from '../fichier/exercice';

export class Commande {

  public numCommande: number = null;

  constructor(public dateCommande: Date, public dateRemise: Date, public description: String,
    public delaiLivraison: number, public valide: boolean, public valeur: number, public liver: boolean,
    public reporter: boolean, public frs: Fournisseur, public exercice: Exercice, public departement?: String, 
    public numDa?: String, public justif?: String, public cmdDe?: String){

  }


}
