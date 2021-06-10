import { Injectable } from '@angular/core';
import {EnumFormat} from "../../models/payloads/enum-format";
import {JoursEnum} from "../../models/enums/jours-enum";

@Injectable({
  providedIn: 'root'
})
export class JoursEnumService {

  constructor() { }

  enumFormatList : EnumFormat[] = [];

  list_of_days(): EnumFormat[]{

    this.enumFormatList.push(new EnumFormat('Lundi', JoursEnum.LUNDI));
    this.enumFormatList.push(new EnumFormat('Mardi', JoursEnum.MARDI));
    this.enumFormatList.push(new EnumFormat('Mercredi', JoursEnum.MERCREDI));
    this.enumFormatList.push(new EnumFormat('Jeudi', JoursEnum.JEUDI));
    this.enumFormatList.push(new EnumFormat('Vendredi', JoursEnum.VENDREDI));
    this.enumFormatList.push(new EnumFormat('Samedi', JoursEnum.SAMEDI));
    this.enumFormatList.push(new EnumFormat('Dimanche', JoursEnum.DIMANCHE));

    return this.enumFormatList;
  }

}
