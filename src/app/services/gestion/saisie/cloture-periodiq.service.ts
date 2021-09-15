import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CloturePeriodiq } from 'src/app/models/gestion/saisie/cloturePeriodiq.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CloturePeriodiqService {

  host: string = environment.backend2;
  private jwtTocken = null;

  constructor(private httpCli: HttpClient) { this.jwtTocken = localStorage.getItem('token'); }

  //Partie réservé pour CloturePeriodiq

  getAllCloturePeriodiq(){
    return this.httpCli.get<CloturePeriodiq[]>(this.host+'/commune/cloturePeriodiq/list', {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});

  }

  getCloturePeriodiqById(code:String){
    return this.httpCli.get<CloturePeriodiq>(this.host+'/commune/cloturePeriodiq/byCodCloPer/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  editACloturePeriodiq(code:String, corps:CloturePeriodiq){
    return this.httpCli.put<CloturePeriodiq>(this.host+'/commune/cloturePeriodiq/byCodCloPer/'+code, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  addACloturePeriodiq(corps:CloturePeriodiq){
    return this.httpCli.post<CloturePeriodiq>(this.host+'/commune/cloturePeriodiq/list', corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  deleteACloturePeriodiq(code:String){
    return this.httpCli.delete<Boolean>(this.host+'/commune/cloturePeriodiq/byCodCloPer/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }


  
}
