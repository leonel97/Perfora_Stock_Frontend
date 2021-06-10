import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UtilisateurComponent} from "./utilisateur.component";
import {UserComponent} from "./user/user.component";
import {UserGroupComponent} from "./user-group/user-group.component";

let routes: Routes = [
  {
    path: '', component: UtilisateurComponent,
    children: [
      {  path: 'user', component: UserComponent },
      {  path: 'user-group', component: UserGroupComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UtilisateurRoutingModule {}
