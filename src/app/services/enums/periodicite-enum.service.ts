import { Injectable } from '@angular/core';
import {EnumFormat} from "../../models/payloads/enum-format";
import {PeriodiciteEnum} from "../../models/enums/periodicite-enum";

@Injectable({
  providedIn: 'root'
})
export class PeriodiciteEnumService {

  constructor() { }

  enumFormatList : EnumFormat[] = [];

  list_of_periodicity(): EnumFormat[]{

    this.enumFormatList.push(new EnumFormat('Hebdomadaire', PeriodiciteEnum.HEBDOMADAIRE));
    this.enumFormatList.push(new EnumFormat('Quinzaine', PeriodiciteEnum.QUINZAINE));
    this.enumFormatList.push(new EnumFormat('Mensuel', PeriodiciteEnum.MENSUEL));
    this.enumFormatList.push(new EnumFormat('Trimestriel', PeriodiciteEnum.TRIMESTRIEL));
    this.enumFormatList.push(new EnumFormat('Semestriel', PeriodiciteEnum.SEMESTRIEL));

    return this.enumFormatList;
  }

}
