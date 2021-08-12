import { Famille } from "../definition/famille.model";
export class StockComptaSetting {

    public numParamCompta: number = null;
  
    constructor(public achat: String, public tvaAchat: number, public compteStock: String, public compteVaStock: String, 
        public tvaVente: number, public exportable: boolean, public famille: Famille){
  
    }
  
  
  }
  