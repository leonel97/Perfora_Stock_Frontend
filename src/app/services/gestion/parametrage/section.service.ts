import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Section} from "../../../models/gestion/parametrage/section";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
  })
  export class SectionService {

    url: string = environment.backend + '/section'; 
    urls: string = environment.backend + '/nacs/section'; 
  
    constructor(private http: HttpClient) { }
  
    createSection(section: Section): Observable<Object> {
      return this.http.post(`${this.url}`, section);
    }
  
    deleteSection(id: number): Observable<Object> {
      return this.http.delete(`${this.url}/${id}`);
    }
  
    updateSection(section: Section): Observable<Object> {
      return this.http.put(`${this.url}`, section);
    }
  
    list(): Observable<Object> {
      return this.http.get(`${this.url}/?page=0&size=10000000`);
    }

    listNacsBySection(sectionId : number): Observable<Object> {
      return this.http.get(`${this.urls}/${sectionId}/?page=0&size=10000000`);
    }
  
  }
  
