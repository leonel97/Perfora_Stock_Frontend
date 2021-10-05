import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppelOffre } from 'src/app/models/gestion/saisie/appelOffre.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppelOffreService {

  host: string = environment.backend2;

  constructor(private httpCli: HttpClient) {  }

    //Partie réservée pour AppelOffre
    getAllAppelOffre(){
      return this.httpCli.get<AppelOffre[]>(this.host+'/stock/appelOffre/list');
    }

    getAAppelOffreById(code:String){
      return this.httpCli.get<AppelOffre>(this.host+'/stock/appelOffre/byCodAppOff/'+code);
    }

    addAAppelOffre(corps:AppelOffre){
      return this.httpCli.post<AppelOffre>(this.host+'/stock/appelOffre/list', corps);
    }

    editAAppelOffre(code:String, corps:AppelOffre){
      return this.httpCli.put<AppelOffre>(this.host+'/stock/appelOffre/byCodAppOff/'+code, corps);
    }

    deleteAAppelOffre(code:String){
      return this.httpCli.delete<boolean>(this.host+'/stock/appelOffre/byCodAppOff/'+code);
    }


}
