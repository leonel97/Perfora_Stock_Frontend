import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Exercice} from "../../../models/gestion/fichier/exercice";
import {AuthService} from "../../../services/common/auth.service";


@Injectable({
  providedIn: 'root'
})
export class ExerciceService {

  url: string = environment.backend2 + '/commune/exercice';

  private jwtTocken = null;

  public selectedExo: Exercice = null;

  constructor(private http: HttpClient) {
    this.jwtTocken = localStorage.getItem('token');
    this.list().subscribe(
      (data: any) => {
        if(data.length){
          //this.selectedExo = data[data.length-1];
          this.selectedExo = data.filter( defaultExo => defaultExo.cloturerExo == false)[0];
          console.log('selected exo', this.selectedExo);
        }
        if( this.selectedExo == undefined ||  this.selectedExo == null)
        this.selectedExo = data[data.length-1];
      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> ' + error.status);

      }
    );
  }

  createExercice(exercice: Exercice): Observable<Object> {
    return this.http.post(`${this.url}/list`, exercice, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  deleteExercice(id: String): Observable<Object> {
    return this.http.delete(`${this.url}/byCodExe/`+ id, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  updateExercice(id : String, exercice: Exercice): Observable<Object> {
    return this.http.put(`${this.url}/byCodExe/${id}`, exercice, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

  list(): Observable<Object> {
    return this.http.get(`${this.url}/list`, {headers: new HttpHeaders({'Authorization' :this.jwtTocken})});
  }

}
