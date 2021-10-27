import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/common/auth.service";
import {SearchService} from "../../services/common/search.service";
import {NavigationService} from "../../services/common/navigation.service";
import {User} from "../../models/gestion/utilisateur/user";
import {HttpErrorResponse} from "@angular/common/http";
import {take, takeWhile} from "rxjs/operators";
import {ExerciceFonction} from "../../models/gestion/utilisateur/exercice-fonction";
import {LocalStoreService} from "../../services/common/local-store.service";
//import { SearchService } from '../../../../services/search.service';

import {Exercice} from "../../models/gestion/fichier/exercice";
import {ExerciceService} from "../../services/gestion/fichier/exercice.service";
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-header-sidebar-large',
  templateUrl: './header-sidebar-large.component.html',
  styleUrls: ['./header-sidebar-large.component.scss']
})
export class HeaderSidebarLargeComponent implements OnInit {

  exerciceFiltered;
  userConnected;
  
  exerciceList: Exercice[] = [];

  notifications: any[];
  currentUser: User;
  defaultExerciceFonction: ExerciceFonction;
  constructor(
    private navService: NavigationService,
    public auth: AuthService,
    private store: LocalStoreService,
    private navigationService: NavigationService,
    private exerciceService: ExerciceService,
  ) {
    this.notifications = [
      {
        icon: 'i-Speach-Bubble-6',
        title: 'New message',
        badge: '3',
        text: 'James: Hey! are you busy?',
        time: new Date(),
        status: 'primary',
        link: '/chat'
      },
      {
        icon: 'i-Receipt-3',
        title: 'New order received',
        badge: '$4036',
        text: '1 Headphone, 3 iPhone x',
        time: new Date('11/11/2018'),
        status: 'success',
        link: '/tables/full'
      },
      {
        icon: 'i-Empty-Box',
        title: 'Product out of stock',
        text: 'Headphone E67, R98, XL90, Q77',
        time: new Date('11/10/2018'),
        status: 'danger',
        link: '/tables/list'
      },
      {
        icon: 'i-Data-Power',
        title: 'Server up!',
        text: 'Server rebooted successfully',
        time: new Date('11/08/2018'),
        status: 'success',
        link: '/dashboard/v2'
      },
      {
        icon: 'i-Data-Block',
        title: 'Server down!',
        badge: 'Resolved',
        text: 'Region 1: Server crashed!',
        time: new Date('11/06/2018'),
        status: 'danger',
        link: '/dashboard/v3'
      }
    ];
  }

  ngOnInit() {

    //list exercice
    this.exerciceService.list().subscribe(
      (data: any) => {
        this.exerciceList = [...data];
        this.exerciceFiltered = this.exerciceList.sort((a, b) => a.codeExercice.localeCompare(b.codeExercice));
        console.log(this.exerciceList);
      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> ' + error.status);
      });

      let token = localStorage.getItem('token');
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);

      console.log('user profil', decodedToken.user);

       this.userConnected = decodedToken.user;
  }

  toggelSidebar() {
    const state = this.navService.sidebarState;
    if (state.childnavOpen && state.sidenavOpen) {
      return state.childnavOpen = false;
    }
    if (!state.childnavOpen && state.sidenavOpen) {
      return state.sidenavOpen = false;
    }
    // item has child items
    if (!state.sidenavOpen && !state.childnavOpen
      && this.navService.selectedItem.type === 'dropDown') {
      state.sidenavOpen = true;
      setTimeout(() => {
        state.childnavOpen = true;
      }, 50);
    }
    // item has no child items
    if (!state.sidenavOpen && !state.childnavOpen) {
      state.sidenavOpen = true;
    }
  }

  signout() {
    this.auth.signout();
  }

  onChange(currentExerciceFonctionId) {
    console.log('ex0',currentExerciceFonctionId);

  }

}

