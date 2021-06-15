import { Magasin } from './magasin.model';

export class Famille {

  public numFamille: number = null;

  constructor(public codeFamille: String, public libFamille: String, public superFamille: Famille,
    public magasin: Magasin){

  }


}
