import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LettreCommande } from 'src/app/models/gestion/saisie/lettreCommande.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LettreCommandeService {

  host: string = environment.backend2;
  private jwtTocken = null;

  constructor(private httpCli: HttpClient) { this.jwtTocken = localStorage.getItem('token'); }

    //Partie réservée pour LettreCommande
    getAllLettreCommande(){
      return this.httpCli.get<LettreCommande[]>(this.host+'/stock/lettreCommande/list', {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    getALettreCommandeById(code:String){
      return this.httpCli.get<LettreCommande>(this.host+'/stock/lettreCommande/byCodLetCom/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    addALettreCommande(corps:LettreCommande){
      return this.httpCli.post<LettreCommande>(this.host+'/stock/lettreCommande/list', corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    editALettreCommande(code:String, corps:LettreCommande){
      return this.httpCli.put<LettreCommande>(this.host+'/stock/lettreCommande/byCodLetCom/'+code, corps, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }

    deleteALettreCommande(code:String){
      return this.httpCli.delete<boolean>(this.host+'/stock/lettreCommande/byCodLetCom/'+code, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
    }


}
