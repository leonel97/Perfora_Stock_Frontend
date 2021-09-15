import { Injectable } from "@angular/core";
import { LocalStoreService } from "./local-store.service";
import { Router } from "@angular/router";
import {BehaviorSubject, Observable, of} from "rxjs";
import {catchError, delay, tap} from "rxjs/operators";
import {environment} from "../../../environments/environment";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {UserService} from "../gestion/utilisateur/user.service";
import {User} from "../../models/gestion/utilisateur/user";
import {ExerciceFonction} from "../../models/gestion/utilisateur/exercice-fonction";
import {JwtHelperService} from "@auth0/angular-jwt";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  //Only for demo purpose
  authenticated = true;
  users: User[] = [];
  url: string = environment.backend + '/authenticate';

  host: string = environment.backend2 +'/commune/user';
  host1: string = environment.backend3 +'/login';
  host2: string = environment.backend3 +'/utilisat';

  private jwttoken = null;



  

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  private currentTokenSubject: BehaviorSubject<string>;
  public currentToken: Observable<string>;

  private currentExerciceFonctionSubject: BehaviorSubject<ExerciceFonction>;
  public currentExerciceFonction: Observable<ExerciceFonction>;

  constructor(
    private store: LocalStoreService,
    private router: Router,
    private http: HttpClient,
    private userService: UserService
  ) {
    this.checkAuth();
  }

  checkAuth() {
    //this.authenticated = this.store.getItem("demo_login_status");
  }

  getuser() {
    return of({});
  }

  /*signin(username:string, password: string, rememberMe: boolean) {
    return this.http.post(`${this.url}`, {
      'username':username,
      'password':password,
      'rememberMe':true
    }).pipe(tap(resData => {
      const token = resData['id_token'];

      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      console.log('Jwt decode ...');
     // console.log(decodedToken.userDetails);
      //const tokenInfo = atob(token.split('.')[1]);
      //console.log(tokenInfo);

      //this.store.setItem('access_token', token);
      //this.store.setItem("demo_login_status", true);
     //this.authenticated = true;
    }));
  }*/

  signout() {
    this.router.navigateByUrl("/");
  }

  logout() {
    this.signout();
  }

  public get currentTokenValue(): string {
    return this.currentTokenSubject.value;
  }

  public getUserFromJwtToken(token:string){
   
  }

  // Léonel user/byCodUser
  getAUtilisateurByLoginMdp(user: User): Observable<Object> {
    return this.http.post<User>(`${this.host}/byLoginMdpUser`, user); 
  }

  // login 
  loginByUsernameAndPassword(user: User): Observable<Object>{
    return this.http.post<User>(`${this.host1}`, user, {observe: "response"}); 

  }

  // find user by username
  findUserByUsername(username: string): Observable<Object>{
    return this.http.get(`${this.host2}/askMdp/${username}`, {observe: "response"}); 

  }

  
  updateUser(idUser: string, user: User): Observable<Object> {
    return this.http.put(`${this.host}/byCodUser/${idUser}`, user, {headers: new HttpHeaders({'Authorization' :this.jwttoken})});
  }

  findUserByLogin(login: string): Observable<Object> {
    if (this.jwttoken == null) {
      this.loadToken();
      
    }
    return this.http.get<User>(`${this.host}/byLoginUser/${login}`, {headers: new HttpHeaders({'Authorization' :this.jwttoken})});
  }

  //save token 
  saveToken(jwt: string){
    localStorage.setItem('token' ,jwt)
  }

  //load token
  loadToken(){
    this.jwttoken = localStorage.getItem('token');

  }


}
