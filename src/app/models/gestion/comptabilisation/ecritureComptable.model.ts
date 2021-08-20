import { Famille } from "../definition/famille.model";
export class EcritureComptable {

    public numEcriCompta: number = null;
  
    constructor(public journal: String, public dateEcri: Date,public pieceEcri: String, public compteEcri: String, 
        public credit: boolean, public centreConsEcri: String, public libEcri: String, public referenceEcri: String,
         public montantEcri: number, public famille:Famille ){
  
    }
  
  
  }
  