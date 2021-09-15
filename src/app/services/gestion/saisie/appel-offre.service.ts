import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppelOffre } from 'src/app/models/gestion/saisie/appelOffre.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppelOffreService {

  host: string = environment.backend2;
  private jwtTocken = null;

  constructor(private httpCli: HttpClient) { this.jwtTocken = localStorage.getItem('token'); }

    //Partie réservée pour AppelOffre
    getAllAppelOffre(){
      return this.httpCli.get<AppelOffre[]>(this.host+'/stock/appelOffre/list', {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    getAAppelOffreById(code:String){
      return this.httpCli.get<AppelOffre>(this.host+'/stock/appelOffre/byCodAppOff/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    addAAppelOffre(corps:AppelOffre){
      return this.httpCli.post<AppelOffre>(this.host+'/stock/appelOffre/list', corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    editAAppelOffre(code:String, corps:AppelOffre){
      return this.httpCli.put<AppelOffre>(this.host+'/stock/appelOffre/byCodAppOff/'+code, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    deleteAAppelOffre(code:String){
      return this.httpCli.delete<boolean>(this.host+'/stock/appelOffre/byCodAppOff/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }


}
