import { DemandePrix } from '../saisie/demandPrix.model';
import { Article } from '../definition/article.model';
import { Uniter } from '../definition/uniter.model';

export class LigneDemandePrix {

    public idLigneDemandePrix:  number = null;

  constructor(public qteLigneDemandePrix: DoubleRange, public designationDemandePrix: String, public designationLigneDemandePrix: String, 
    public demandePrix: DemandePrix, public article: Article, public uniter: Uniter){

  }


}
