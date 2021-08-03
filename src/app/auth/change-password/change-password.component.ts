import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ResolveEnd, ResolveStart, RouteConfigLoadEnd, RouteConfigLoadStart, Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {UserAccountService} from "../../services/common/user-account.service";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit { 
  loading: boolean;
  loadingText: string;
  changePasswordFailError: string;
  changePasswordForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private userAccountService: UserAccountService,
    private router: Router
  ) { }

  ngOnInit() {

    this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart || event instanceof ResolveStart) {
        this.loadingText = 'Chargement...';

        this.loading = true;
      }
      if (event instanceof RouteConfigLoadEnd || event instanceof ResolveEnd) {
        this.loading = false;
      }
    });

    this.changePasswordForm = this.fb.group({
      currentPassword: [null, Validators.required],
      newPassword: [null, Validators.required],
      newPasswordConfirm: [null, Validators.required]
    });
  }
  changePassword() {
    this.loading = true;
    this.loadingText = 'processing password change...';
    this.changePasswordFailError = '';
    const currentPassword = this.changePasswordForm.value.currentPassword;
    const newPassword = this.changePasswordForm.value.newPassword;
    const newPasswordConfirm = this.changePasswordForm.value.newPasswordConfirm;
    if(newPassword!='' && newPassword==newPasswordConfirm){
      this.userAccountService.changePassword(currentPassword, newPassword)
        .subscribe(res => {
          console.log('Retour changement mot de passe: '+res);
          this.router.navigateByUrl('/');
          this.loading = false;
        }, (error: HttpErrorResponse) => {
          console.log('Erreur ...');
          console.log(error);
          this.loading = false;
          this.changePasswordFailError = 'Erreur: Le changement de mot de passe a échoué!';
        });
    }

  }

}

