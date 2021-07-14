import { Injectable } from "@angular/core";
import { LocalStoreService } from "./local-store.service";
import { Router } from "@angular/router";
import {BehaviorSubject, Observable, of} from "rxjs";
import {catchError, delay, tap} from "rxjs/operators";
import {environment} from "../../../environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
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
    this.currentUserSubject = new BehaviorSubject<User>(this.store.getItem('currentUser'));
    this.currentUser = this.currentUserSubject.asObservable();

    this.currentTokenSubject = new BehaviorSubject<string>(this.store.getItem('access_token'));
    this.currentToken = this.currentTokenSubject.asObservable();

    this.currentExerciceFonctionSubject = new BehaviorSubject<ExerciceFonction>(this.store.getItem('currentExerciceFonction'));
    this.currentExerciceFonction = this.currentExerciceFonctionSubject.asObservable();
  }

  checkAuth() {
    this.authenticated = this.store.getItem("demo_login_status");
  }

  getuser() {
    return of({});
  }

  signin(username:string, password: string, rememberMe: boolean) {
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

      this.store.setItem('access_token', token);
      this.store.setItem("demo_login_status", true);
      this.authenticated = true;
    }));
  }

  signout() {
    this.authenticated = false;
    this.store.setItem("demo_login_status", false);
    this.store.setItem("access_token", false);
    this.router.navigateByUrl("/");
  }

  logout() {
    this.signout();
  }

  public get currentTokenValue(): string {
    return this.currentTokenSubject.value;
  }

  public getUserFromJwtToken(token:string){
    //const user = JSON.parse(atob(token.split('.')[1])).userDetails;
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    const user  = decodedToken.userDetails;
    user.defaultExerciceFonction =  user.exercicefonctions.find(e => e.defaultexe == true);
    user.currentExerciceFonction =  user.defaultExerciceFonction;
    this.store.setItem('currentExerciceFonction',user.currentExerciceFonction);
    return user;
  }

}
