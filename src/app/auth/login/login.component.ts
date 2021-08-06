import { Component, OnInit } from '@angular/core';
import {ResolveEnd, ResolveStart, RouteConfigLoadEnd, RouteConfigLoadStart, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/common/auth.service";
import { User } from 'src/app/models/gestion/utilisateur/user';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loading: boolean;
  loadingText: string;
  authenticationFailError: string;
  signinForm: FormGroup;
  confirmation: boolean = false;

  userUpdated : User = null;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {

    this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart || event instanceof ResolveStart) {
        this.loadingText = 'Veuillez patienter...';

        this.loading = true;
      }
      if (event instanceof RouteConfigLoadEnd || event instanceof ResolveEnd) {
        this.loading = false;
      }
    });

    this.signinForm = this.fb.group({
      login: [null, Validators.required],
      motDePass: [null, Validators.required],
      password_confirmation: null
    });
    //this.makeForm(null);
  }

  /*makeForm(user: User): void {
    this.signinForm = this.fb.group({
      idUtilisateur: [user != null ? user.idUtilisateur: null],
      nomUtilisateur: [user != null ? user.nomUtilisateur: null,
        [Validators.required]],
        prenomUtilisateur: [user != null ? user.prenomUtilisateur: null,
        [Validators.required]],
        civilite: [user != null ? user.civilite: null,
        [Validators.required]],
      profession: [user != null ? user.profession: null],
      fonction: [user != null ? user.fonction: null],
      service: [user != null ? user.service: null],
      groupUser: [user != null ? user.groupUser: null],
      activeUtilisateur: [user != null ? user.activeUtilisateur: false],
      askMdp1erLance: [user != null ? user.askMdp1erLance: true],
      //authorities: [user != null ? user.authorities: null],
      login: [user != null ? user.login: null,
        [Validators.required]],
        motDePass: [user != null ? user.motDePass: null,
        [Validators.required]],
      password_confirmation: [user != null ? user.motDePass: null,
        [Validators.required]],
    });
  }*/

  signin() {
    this.loading = true;
    this.authenticationFailError = '';
    /*this.loadingText = 'Connexion encours...';
    const username = this.signinForm.value.login;
    const password = this.signinForm.value.password;
    const rememberMe = true;
    this.router.navigateByUrl('/gestion/accueil');
    this.auth.signin(username, password, rememberMe)
      .subscribe(res => {
        this.router.navigateByUrl('/gestion/accueil');
        this.loading = false;*
      });*/
      this.loading = false;

      //Auth

      if(this.confirmation){
      
        if(this.signinForm.value.motDePass == this.signinForm.value.password_confirmation){

          this.auth.getAUtilisateurByLoginMdp(this.signinForm.value).subscribe(
            (data : User) => {

              // modifier user 
              data.askMdp1erLance = false;
              data.motDePass = this.signinForm.value.motDePass;
              console.log('var', data);
              
              
          this.auth.updateUser(data.idUtilisateur.toString(), data).subscribe(
            (data : User) => {
              //this.utilisateurService.connectedUser = data;
              console.log('connected', data);
              //this.utilisateurService.isAuth = true;
              this.router.navigateByUrl('/gestion/accueil');
  
            },
            (erreur) => {
              console.log('Erreur lors de la connexion au serveur', erreur);
            }
          );

          } );

        }
        else{
          this.authenticationFailError = 'Erreur: Confirmation de Mot de passe incorrect';
        }
        
        
      }
      else{
        this.auth.getAUtilisateurByLoginMdp(this.signinForm.value).subscribe(
          (data) => {
            if(data){
              //this.utilisateurService.connectedUser = data; 
              //this.auth.isAuth = true;
              this.router.navigateByUrl('/gestion/accueil');
            }
            else{
             this.authenticationFailError = 'Erreur: Identifiant Ou Mot de Passe Incorrecte';
            }
          },
          (erreur) => {
            console.log('Erreur lors de la connexion au serveur', erreur);
            
            console.log('Erreur lors de connexion au serveur.\n Code : '+erreur.status+' | '+erreur.statusText, 'Connexion');
          }
          
        );
      }

  }



  // confirmation function
  showConfirmation(){
    const formData = this.signinForm.value;
    console.log('user', formData);
    
    
    this.auth.getAUtilisateurByLoginMdp(formData).subscribe(
      (data : User) => {
        this.confirmation = false;
        if(data){
          if (data.login == formData.login && data.askMdp1erLance == true){
            this.confirmation = true;
          }
           
        }
        else{
          this.confirmation = false;
        }
      },
      (erreur) => {
        console.log('Erreur lors de la connexion au serveur', erreur);
        
        //this.toastr.error('Erreur lors de connexion au serveur.\n Code : '+erreur.status+' | '+erreur.statusText, 'Connexion');
      }
    );

  }

}
