import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CloturePeriodiq } from 'src/app/models/gestion/saisie/cloturePeriodiq.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CloturePeriodiqService {

  host: string = environment.backend2;

  constructor(private httpCli: HttpClient) {}

  //Partie réservé pour CloturePeriodiq

  getAllCloturePeriodiq(){
    return this.httpCli.get<CloturePeriodiq[]>(this.host+'/commune/cloturePeriodiq/list');

  }

  getCloturePeriodiqById(code:String){
    return this.httpCli.get<CloturePeriodiq>(this.host+'/commune/cloturePeriodiq/byCodCloPer/'+code);
  }

  editACloturePeriodiq(code:String, corps:CloturePeriodiq){
    return this.httpCli.put<CloturePeriodiq>(this.host+'/commune/cloturePeriodiq/byCodCloPer/'+code, corps);
  }

  validateACloturePeriodiq(code:String, corps:CloturePeriodiq){
    return this.httpCli.put<CloturePeriodiq>(this.host+'/commune/cloturePeriodiq/byCodCloPerValid/'+code, corps);
  }

  addACloturePeriodiq(corps:CloturePeriodiq){
    return this.httpCli.post<CloturePeriodiq>(this.host+'/commune/cloturePeriodiq/list', corps);
  }

  deleteACloturePeriodiq(code:String){
    return this.httpCli.delete<Boolean>(this.host+'/commune/cloturePeriodiq/byCodCloPer/'+code);
  }
  isPeriodeCloturedByDate(corps:Date){
    return this.httpCli.post<Boolean>(this.host+'/commune/cloturePeriodiq/isCloturedByDate', {date:corps});
  }


  
}
