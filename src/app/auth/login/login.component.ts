import { Component, OnInit } from '@angular/core';
import {ResolveEnd, ResolveStart, RouteConfigLoadEnd, RouteConfigLoadStart, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/common/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loading: boolean;
  loadingText: string;
  signinForm: FormGroup;
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
      email: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

  signin() {
    this.loading = true;
    this.loadingText = 'Connexion encours...';
    const username = this.signinForm.value.email;
    const password = this.signinForm.value.password;
    const rememberMe = true;
    this.router.navigateByUrl('/gestion/parametrage');
    this.auth.signin(username, password, rememberMe)
      .subscribe(res => {
        this.router.navigateByUrl('/gestion/parametrage');
        this.loading = false;
      });
  }

}
