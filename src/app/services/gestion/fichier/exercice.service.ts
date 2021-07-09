import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {Exercice} from "../../../models/gestion/fichier/exercice";


@Injectable({
  providedIn: 'root'
})
export class ExerciceService {

  url: string = environment.backend2 + '/commune/exercice';

   selectedExo: Exercice = null;

  constructor(private http: HttpClient) {
    this.list().subscribe(
      (data: any) => {
        if(data.length){
          this.selectedExo = data[data.length-1];
          console.log('selected exo', this.selectedExo);
        }
      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> ' + error.status);

      }
    );
  }

  createExercice(exercice: Exercice): Observable<Object> {
    return this.http.post(`${this.url}/list`, exercice);
  }

  deleteExercice(id: String): Observable<Object> {
    return this.http.delete(`${this.url}/byCodExe/`+ id);
  }

  updateExercice(id : String, exercice: Exercice): Observable<Object> {
    return this.http.put(`${this.url}/byCodExe/${id}`, exercice);
  }

  list(): Observable<Object> {
    return this.http.get(`${this.url}/list`);
  }

}
