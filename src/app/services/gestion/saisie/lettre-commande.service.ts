import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LettreCommande } from 'src/app/models/gestion/saisie/lettreCommande.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LettreCommandeService {

  host: string = environment.backend2;

  constructor(private httpCli: HttpClient) { }

    //Partie réservée pour LettreCommande
    getAllLettreCommande(){
      return this.httpCli.get<LettreCommande[]>(this.host+'/stock/lettreCommande/list');
    }

    getLettreCommandeByCodeExo(code:String){
      return this.httpCli.get<LettreCommande[]>(this.host+'/stock/lettreCommande/byCodExo/'+code);
    }

    getALettreCommandeById(code:String){
      return this.httpCli.get<LettreCommande>(this.host+'/stock/lettreCommande/byCodLetCom/'+code);
    }

    addALettreCommande(corps:LettreCommande){
      return this.httpCli.post<LettreCommande>(this.host+'/stock/lettreCommande/list', corps);
    }

    editALettreCommande(code:String, corps:LettreCommande){
      return this.httpCli.put<LettreCommande>(this.host+'/stock/lettreCommande/byCodLetCom/'+code, corps);
    }

    deleteALettreCommande(code:String){
      return this.httpCli.delete<boolean>(this.host+'/stock/lettreCommande/byCodLetCom/'+code);
    }


}
