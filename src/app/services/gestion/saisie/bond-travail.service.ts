import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BondTravail } from 'src/app/models/gestion/saisie/bondTravail.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BondTravailService {

  host: string = environment.backend2;

  constructor(private httpCli: HttpClient) { }

  //Partie réservée pour BondTravail
  getAllBondTravail(){
    return this.httpCli.get<BondTravail[]>(this.host+'/stock/bondTravail/list');
  }

  getABondTravailById(code:String){
    return this.httpCli.get<BondTravail>(this.host+'/stock/bondTravail/byCodBonTra/'+code);
  }

  addABondTravail(corps:BondTravail){
    return this.httpCli.post<BondTravail>(this.host+'/stock/bondTravail/list', corps);
  }

  editABondTravail(code:String, corps:BondTravail){
    return this.httpCli.put<BondTravail>(this.host+'/stock/bondTravail/byCodBonTra/'+code, corps);
  }

  deleteABondTravail(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/bondTravail/byCodBonTra/'+code);
  }


}
