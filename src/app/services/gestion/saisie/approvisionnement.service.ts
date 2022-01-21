import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Approvisionnement } from 'src/app/models/gestion/saisie/approvisionnement.model';
import { EncapApprovisionnement } from 'src/app/models/gestion/saisie/encapsuleur-model/encapApprovisionnement.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApprovisionnementService {



  host: string = environment.backend2;

  constructor(private httpCli: HttpClient) { }

    //Partie réservée pour Bon Approvisionnement
    getAllAppro(){
      return this.httpCli.get<Approvisionnement[]>(this.host+'/stock/approvisionnement/list');
    }

    getAApproById(code:String){
      return this.httpCli.get<Approvisionnement>(this.host+'/stock/approvisionnement/byCodApp/'+code);
    }

    addAAppro(corps:Approvisionnement){
      return this.httpCli.post<Approvisionnement>(this.host+'/stock/approvisionnement/list', corps);
    }

    addAAppro2(corps:EncapApprovisionnement){
      return this.httpCli.post<EncapApprovisionnement>(this.host+'/stock/approvisionnement/list2', corps);
    }

    editAAppro(code:String, corps:Approvisionnement){
      return this.httpCli.put<Approvisionnement>(this.host+'/stock/approvisionnement/byCodApp/'+code, corps);
    }

    editAAppro2(code:String, corps:EncapApprovisionnement){
      return this.httpCli.put<EncapApprovisionnement>(this.host+'/stock/approvisionnement/byCodApp2/'+code, corps);
    }

    editAAppro3(code:String, corps:Approvisionnement){
      return this.httpCli.put<Approvisionnement>(this.host+'/stock/approvisionnement/byCodApp3/'+code, corps);
    }

    editAAppro4(code:String, corps:Approvisionnement){
      return this.httpCli.put<Approvisionnement>(this.host+'/stock/approvisionnement/byCodApp4/'+code, corps);
    }

    deleteAAppro(code:String){
      return this.httpCli.delete<boolean>(this.host+'/stock/approvisionnement/byCodApp/'+code);
    }

    deleteAAppro2(code:String){
      return this.httpCli.delete<boolean>(this.host+'/stock/approvisionnement/byCodApp2/'+code);
    }

}
