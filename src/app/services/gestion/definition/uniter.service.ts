import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Uniter } from 'src/app/models/gestion/definition/uniter.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UniterService {

  host: string = environment.backend2;

  constructor(private httpCli: HttpClient) { }

  //Partie réservé pour les Unités
  getAllUniter(){
    return this.httpCli.get<Uniter[]>(this.host+'/stock/uniter/list');

  }

  getUniterById(code:String){
    return this.httpCli.get<Uniter>(this.host+'/stock/uniter/byCodUni/'+code);
  }

  editAUniter(code:String, corps:Uniter){
    return this.httpCli.put<Uniter>(this.host+'/stock/uniter/byCodUni/'+code, corps);
  }

  addAUniter(corps:Uniter){
    return this.httpCli.post<Uniter>(this.host+'/stock/uniter/list', corps);
  }

  deleteAUniter(code:String){
    return this.httpCli.delete<Boolean>(this.host+'/stock/uniter/byCodUni/'+code);
  }





}
