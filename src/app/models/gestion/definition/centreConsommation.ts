import {TypeCentreConsommation} from './typeCentreConsommation'
import {Direction} from './direction'

export class CentreConsommation {
    numService: number;
    codeService: string;
    libService: string;
    direction: Direction; 
    typeService: TypeCentreConsommation;
    superService: CentreConsommation;
}
