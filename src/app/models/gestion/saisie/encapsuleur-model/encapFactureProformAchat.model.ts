import { FactureProFormAcha } from '../factureProFormAcha.model';
import { LigneFactureProFormAchat } from '../ligneFactureProFormAchat.model';

export class EncapFactureProformAchat{

  constructor(public factureProFormAcha: FactureProFormAcha,
    public factureProFormAchats: LigneFactureProFormAchat[]){

    }


}
