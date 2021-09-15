import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BondTravail } from 'src/app/models/gestion/saisie/bondTravail.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BondTravailService {

  host: string = environment.backend2;
  private jwtTocken = null;

  constructor(private httpCli: HttpClient) { this.jwtTocken = localStorage.getItem('token'); }

  //Partie réservée pour BondTravail
  getAllBondTravail(){
    return this.httpCli.get<BondTravail[]>(this.host+'/stock/bondTravail/list', {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  getABondTravailById(code:String){
    return this.httpCli.get<BondTravail>(this.host+'/stock/bondTravail/byCodBonTra/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  addABondTravail(corps:BondTravail){
    return this.httpCli.post<BondTravail>(this.host+'/stock/bondTravail/list', corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  editABondTravail(code:String, corps:BondTravail){
    return this.httpCli.put<BondTravail>(this.host+'/stock/bondTravail/byCodBonTra/'+code, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  deleteABondTravail(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/bondTravail/byCodBonTra/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }


}
