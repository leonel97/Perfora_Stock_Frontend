import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Magasin } from 'src/app/models/gestion/definition/magasin.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MagasinService {

  host: string = environment.backend2;

  constructor(private httpCli: HttpClient) { }

  //Partie réservée Magasin
  getAllMagasin(){
    return this.httpCli.get<Magasin[]>(this.host+'/stock/magasin/list');
  }

  getAMagasinById(code:String){
    return this.httpCli.get<Magasin>(this.host+'/stock/magasin/byCodMag/'+code);
  }

  addAMagasin(corps:Magasin){
   return this.httpCli.post<Magasin>(this.host+'/stock/magasin/list', corps);
  }

  addAListMagasin(corps: Magasin[]){
    return this.httpCli.post<Magasin[]>(this.host+'/stock/magasin/list2', corps);
  }

  editAMagasin(code:String, corps:Magasin){
    return this.httpCli.put<Magasin>(this.host+'/stock/magasin/byCodMag/'+code, corps);
  }

  deleteAMagasin(code:String){
   return this.httpCli.delete<boolean>(this.host+'/stock/magasin/byCodMag/'+code);
  }




}
