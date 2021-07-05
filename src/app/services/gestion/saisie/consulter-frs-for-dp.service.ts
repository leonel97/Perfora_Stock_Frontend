import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConsulterFrsForDp } from 'src/app/models/gestion/saisie/consulterFrsForDp.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConsulterFrsForDpService {

  host: string = environment.backend2;

  constructor(private httpCli: HttpClient) { }

  //Partie réservé pour ConsulterFrsForDp

  getAllConsulterFrsForDp(){
    return this.httpCli.get<ConsulterFrsForDp[]>(this.host+'/stock/consulterFrsForDp/list');

  }

  getConsulterFrsForDpById(code:String){
    return this.httpCli.get<ConsulterFrsForDp>(this.host+'/stock/consulterFrsForDp/byCodConFrsForDp/'+code);
  }

  editAConsulterFrsForDp(code:String, corps:ConsulterFrsForDp){
    return this.httpCli.put<ConsulterFrsForDp>(this.host+'/stock/consulterFrsForDp/byCodConFrsForDp/'+code, corps);
  }

  addAConsulterFrsForDp(corps:ConsulterFrsForDp){
    return this.httpCli.post<ConsulterFrsForDp>(this.host+'/stock/consulterFrsForDp/list', corps);
  }

  deleteAConsulterFrsForDp(code:String){
    return this.httpCli.delete<Boolean>(this.host+'/stock/consulterFrsForDp/byCodConFrsForDp/'+code);
  }



}

