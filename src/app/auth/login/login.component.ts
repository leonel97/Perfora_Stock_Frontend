import { Component, OnInit } from '@angular/core';
import {ResolveEnd, ResolveStart, RouteConfigLoadEnd, RouteConfigLoadStart, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/common/auth.service";
import { User } from 'src/app/models/gestion/utilisateur/user';
import { HttpResponse } from '@angular/common/http';
import {JwtHelperService} from "@auth0/angular-jwt";
import { SharedAnimations } from 'src/app/animations/shared-animations';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [SharedAnimations]
})
export class LoginComponent implements OnInit {
  loading: boolean;
  loadingText: string;
  authenticationFailError: string;
  signinForm: FormGroup;

  confirmation: boolean = false;
  authentificationok: boolean = false;

  

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


      if(this.confirmation){

      
        if(this.signinForm.value.motDePass == this.signinForm.value.password_confirmation){

          this.auth.findUserByLogin(this.signinForm.value.login).subscribe(
            (data : User) => {
              console.log('user up', data);

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
        
        let userAuth = new User(this.signinForm.value.login,this.signinForm.value.motDePass, null,null, null, null,null, null, null, null, null, null, null );
       
        /*userAuth.login = this.signinForm.value.login;
        userAuth.motDePass = this.signinForm.value.motDePass;*/
        console.log('auth data', userAuth);

        this.auth.loginByUsernameAndPassword(userAuth).subscribe(
          (data1 : HttpResponse<any>) =>{
         // console.log('verifier',data1.headers.get("Authorization"));
          let token = data1.headers.get("Authorization");

          const helper = new JwtHelperService();
          const decodedToken = helper.decodeToken(token);

          //console.log('user Details', decodedToken);

          let userConnected = decodedToken.user
         // console.log('user conected', userConnected);

          if (userConnected && userConnected.activeUtilisateur == true) {
  
          this.auth.saveToken(token);
          this.router.navigateByUrl('/gestion/accueil');
         
          } else if (userConnected && userConnected.activeUtilisateur == false || userConnected.activeUtilisateur == null || userConnected.activeUtilisateur == undefined ) {

            this.authenticationFailError = 'Erreur: Votre Compte n\'est pas actif. Veuillez contacter votre administrateur !!!';
            
          }
          else{
            this.authenticationFailError = 'Erreur lors du décodage de lUtilisateur du jeton. Veuillez contacter votre administrateur !!!';
          }
         
        },
        (erreur) => {
          console.log('Erreur lors de la connexion au serveur', erreur);
          this.authenticationFailError = 'Erreur: Identifiant Ou Mot de Passe Incorrecte';
        }
        );

        
      }

  }



  // confirmation function
  showConfirmation(){
    const formData = this.signinForm.value;
    console.log('user', formData);
    
    
   /* this.auth.getAUtilisateurByLoginMdp(formData).subscribe(
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
    );*/

    this.auth.findUserByUsername(this.signinForm.value.login).subscribe(
      (data: HttpResponse<any>) =>{
        this.confirmation = true;
        
        let token = data.headers.get("Authorization");
        //console.log('verf', token);
        this.auth.saveToken(token);
        

      },
      (erreur) => {
        console.log('Erreur lors de la connexion ', erreur);
        
      }
    )
  }

}
