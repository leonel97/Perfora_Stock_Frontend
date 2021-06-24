import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {GestionComponent} from "./gestion.component";

let routes: Routes = [
  {
    path: '', component: GestionComponent,
    children: [
      {  path: 'dashboard',
         loadChildren: () => import('./dashboard/dashboard.module').then(d => d.DashboardModule)
      },
      {  path: 'parametrage',
        loadChildren: () => import('./parametrage/parametrage.module').then(p => p.ParametrageModule)
      },
      {
        path: 'utilisateur',
        loadChildren: () => import('./utilisateur/utilisateur.module').then(u => u.UtilisateurModule)
      },
      {
        path: 'definition',
        loadChildren: () => import('./definition/definition.module').then(dj => dj.DefinitionModule)
      },
      {
        path: 'fichier',
        loadChildren: () => import('./fichier/fichier.module').then(dj => dj.FichierModule)
      },
      {
        path: 'saisie',
        loadChildren: () => import('./saisie/saisie.module').then(dj => dj.SaisieModule)
      },
      {
        path: 'rapport',
        loadChildren: () => import('./rapport/rapport.module').then(ra => ra.RapportModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionRoutingModule {}

