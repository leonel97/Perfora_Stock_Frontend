import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../../models/gestion/utilisateur/user";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class UserAccountService {
  url: string = environment.backend + '/account';

  constructor(private http: HttpClient) { }

  changePassword(currentPassword: string, newPassword:string): Observable<Object> {
    const passwords = {
      'currentPassword':currentPassword,
      'newPassword':newPassword
    };
    console.log(passwords);
    return this.http.post(`${this.url}/change-password`, {
      'currentPassword':currentPassword,
      'newPassword':newPassword
    });
  }

  saveAccount(user: User): Observable<Object> {
    return this.http.post(`${this.url}`, user);
  }
}
