import { Exercice } from '../fichier/exercice';
import { Famille } from './famille.model';
import { Fournisseur } from './fournisseur';
import { TypeArticle } from './typeArticle.model';

export class Article {

  public numArticle: number = null;

  constructor(public codeArticle: String, public libArticle: String, public stockerArticle: boolean,
    public numSerieArticle: boolean, public livrableArticle: boolean, public consommableArticle: boolean,
    public prixVenteArticle: number, public couleurArticle: String, public qteStIniTres: number,
    public puStIniTres: number, public datStInitArtTres: Date, public specialiterArticle: String,
    public abregerArticle: String, public compteArticle: String, public codeBareArticle: String,
    public tvaArticle: number, public taxeSpecifiqArticle: number, public afficherArticle: boolean,
    public cmupActuArticle: number, public stockMinimArticle: number, public stockAlertArticle: number,
    public stockSecurArticle: number, public exo: Exercice, public famille: Famille, public fournisseur: Fournisseur,
    public typeArticle: TypeArticle){

  }


}
